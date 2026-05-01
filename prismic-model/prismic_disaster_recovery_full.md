# Prismic Disaster Recovery Runbook

---

## Table of Contents

- [Overview](#overview)
- [What Is Backed Up](#what-is-backed-up)
- [Scenario Matrix](#scenario-matrix)
- [Restore Scripts](#restore-scripts)
  - [Prerequisites](#prerequisites)
  - [Status Files](#status-files)
  - [Script Reference](#script-reference)
- [Scenarios & Restore Procedures](#scenarios--restore-procedures)
  - [Scenario 1 — Full Repository Loss (new repo required)](#scenario-1--full-repository-loss-new-repo-required)
  - [Scenario 2 — Partial Document Loss (repo exists)](#scenario-2--partial-document-loss-repo-exists)
  - [Scenario 3 — Media Library Loss (repo and content intact)](#scenario-3--media-library-loss-repo-and-content-intact)
  - [Scenario 4 — Custom Types Lost, Content Intact](#scenario-4--custom-types-lost-content-intact)
- [Frontend Cutover Guide](#frontend-cutover-guide)
- [Validation Checklist](#validation-checklist)

---

## Overview

This document describes practical disaster-recovery (DR) scenarios for Prismic and the runbook steps to restore the site using the backups we maintain.

> **Time to recover (worst case Scenario 1 estimate):** ~3–4 hours for assets (≈10,000 assets at 1 req/sec) + ~1.5 hours for content (≈5,000 documents at 1 req/sec), plus repository/custom types setup etc. Plan for a full day.

> **Tip:** Practice the full Scenario 1 runbook at least once a quarter — it is the most operationally demanding scenario and benefits from familiarity before an emergency.

---

## What Is Backed Up

- **Custom Types**: Models stored in the wellcomecollection.org repository under [`/common/customtypes`](https://github.com/wellcomecollection/wellcomecollection.org/tree/main/common/customtypes) and [`/common/views/slices`](https://github.com/wellcomecollection/wellcomecollection.org/tree/main/common/views/slices).
- **Content Exports**: JSON exports of all published documents are [backed up to S3 on a daily basis](https://github.com/wellcomecollection/content-api/blob/main/infrastructure/prismic-snapshots/README.md).
- **Media Library**: Original binary assets (images, audio, video, PDFs) are [backed up to S3 on a daily basis](https://github.com/wellcomecollection/content-api/blob/main/infrastructure/prismic-snapshots/README.md).

These three things together allow a complete rebuild of the repository from scratch.

> **Not backed up:** Prismic users and permissions. Recreate them manually after restore.

---

## Scenario Matrix

| #   | Scenario                  | Impact                                 | Primary restore path                                               |
| --- | ------------------------- | -------------------------------------- | ------------------------------------------------------------------ |
| 1   | **Full repository loss**  | Everything gone, new repo required     | Restore custom types → assets → rewrite snapshot → restore content |
| 2   | **Partial document loss** | Some/all docs missing, repo exists     | Restore content from snapshot (assets already present)             |
| 3   | **Media library loss**    | Broken asset URLs, repo and docs exist | Re-upload assets → rewrite snapshot → update content               |
| 4   | **Custom types lost**     | UI unusable, content intact            | Re-push custom type JSON via Slice Machine                         |

---

## Restore Scripts

All restore scripts live in `prismic-model/restore/` and are run from the `prismic-model` directory.

### Prerequisites

1. **AWS credentials** — the scripts download backups from S3 and read asset binaries:

   ```bash
   aws sso login
   ```

2. **`.env` file** — create `prismic-model/.env` with:

   ```
   PRISMIC_S3_BUCKET=<bucket name containing the backups>
   PRISMIC_REPO=<target Prismic repository name>
   PRISMIC_WRITE_API_TOKEN=<Prismic Migration API token for the target repo>
   ```

   The write API token is created/available in: Prismic dashboard → repository → Settings → API & Security → Write APIs.

3. **Install dependencies**:
   ```bash
   cd prismic-model && yarn install
   ```

### Status Files

The scripts write progress files to `restore/status/`. Understanding them helps with resuming interrupted runs and knowing when it is safe to clean up.

| File                       | Behaviour                                                 | Purpose                                                                 |
| -------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------- |
| `used-assets.json`         | Overwritten each run                                      | Asset IDs referenced in the snapshot                                    |
| `existing-assets.json`     | Overwritten each run                                      | Asset IDs already present in the target repo                            |
| `asset-id-map.json`        | Append-only — **do not delete until restore is complete** | old asset ID → new asset ID; prevents re-uploading on resume            |
| `asset-slug-map.json`      | Append-only — **do not delete until restore is complete** | old URL path segment → new URL path segment; used to rewrite asset URLs |
| `content-id-map.json`      | Append-only — **do not delete until restore is complete** | old document ID → new document ID; prevents re-creating docs on resume  |
| `asset-upload-failed.json` | Replaced each run                                         | IDs that failed to upload in the most recent run                        |

All three append-only files are written to the gitignored `restore/status/` directory. After a successful `restorePrismicContent` run, you can delete them once you are sure the restore is complete and you do not need to resume it.

> **Resuming after interruption:** Simply re-run the same script. It will skip anything already recorded in the map files.

### Script Reference

| Script             | Command                      | Description                                                                                                                                                                                                                                                                                                                                                      |
| ------------------ | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Restore assets     | `yarn restorePrismicAssets`  | Downloads the assets manifest and snapshot, uploads missing assets to the target repo, writes `asset-id-map.json` and `asset-slug-map.json`                                                                                                                                                                                                                      |
| Transform snapshot | `yarn transformSnapshot`     | Prepares the snapshot for import: rewrites asset IDs, content document IDs (if content-id-map.json exists), fixes URL slugs, backfills article publish dates, optionally rewrites repo name in asset URLs; writes `restore/snapshot/prismic-snapshot-rewritten.json`. Automatically detects which maps are available and only applies available transformations. |
| Restore content    | `yarn restorePrismicContent` | Uploads documents from a snapshot to the target repo using the Migration API, creates/updates `content-id-map.json` to track old ID → new ID mappings                                                                                                                                                                                                            |

**Flags:**

`yarn restorePrismicAssets` — no flags needed; reads everything from `.env`.

`yarn transformSnapshot`

```
--source-repo <name>   Source repository name (e.g. wellcomecollection) — required for URL rewriting
--target-repo <name>   Target repository name — required for URL rewriting
--snapshot <path>      Override the source snapshot (default: latest in ./restore/snapshot/)
--out <path>           Override the output path (default: ./restore/snapshot/prismic-snapshot-rewritten.json)
```

`yarn restorePrismicContent`

```
--snapshot <path>   Path to the snapshot to restore (default: latest downloaded from S3)
--type <typeId>     Only restore documents of this custom type (e.g. --type pages)
```

---

## Scenarios & Restore Procedures

### Scenario 1 — Full Repository Loss (new repo required)

**Symptoms:** Cannot access the Prismic account or repository; API endpoints return errors; media links broken; frontend fails completely.

#### Step 1 — Create a new repository

1. Log into the [Prismic dashboard](https://prismic.io/dashboard).
2. Create a new repository — choose Next.js and "Connect your own web app".
3. Give it a name. Try the original name; if it is unavailable, choose a temporary name and update it later.
4. After creation go to **Settings → Translations & locales**, add `English - United Kingdom` and set it as the master locale. This must be done or the migration api will error when we try to upload our content.

#### Step 2 — Restore custom types

1. If the repository name has changed, update `repositoryName` in `/common/slicemachine.config.json`.
2. From the repository root, run Slice Machine:
   ```bash
   yarn slicemachine
   ```
3. Open [http://localhost:9999](http://localhost:9999) and log in.
4. **Disabled custom types:** Some types have `"status": false` which prevents them being pushed. Temporarily set these to `true`, push all types, then revert back to `false` and push again.
5. Click **Review changes** then **Push**. Verify in the Prismic dashboard that types appear when creating a new document.

#### Step 3 — Restore media assets

Assets must be uploaded before content because the Migration API validates asset references.

```bash
cd prismic-model
aws sso login
yarn restorePrismicAssets
```

The script will:

- Download the latest assets manifest and content snapshot from S3.
- Identify which assets are referenced in the snapshot.
- Fetch existing assets from the target repo (to avoid duplicates).
- Upload only the missing assets, rate-limited to 1 request/sec.
- Save `restore/status/asset-id-map.json` and `restore/status/asset-slug-map.json` after each upload.

The script is **safe to interrupt and resume** — re-running it will skip already-uploaded assets.

> AWS credentials expire after a period. If the script exits with a credentials error, run `aws sso login` and re-run the script. Progress is saved.

> **Note:** If the asset upload runs for a long time (hours), your AWS credentials may expire before you reach Step 4. Run `aws sso login` again before running `transformSnapshot` if needed.

#### Step 4 — Rewrite the snapshot (first pass)

Because the new repo issues new asset IDs and hosts assets under potentially different URLs, the snapshot must be rewritten before content is imported.

```bash
yarn transformSnapshot \
  --source-repo wellcomecollection \
  --target-repo <new-repo-name>
```

This produces `restore/snapshot/prismic-snapshot-rewritten.json` with:

- All old asset IDs replaced with new ones.
- All asset URL path segments updated to match the filenames Prismic generated on upload.
- Repository name replaced in `images.prismic.io` and `cdn.prismic.io` URLs.

> If the repository name is unchanged, omit `--source-repo` and `--target-repo`. The script will still rewrite asset IDs and URL slugs.

> **Note:** Content relationship fields will not be corrected yet as `content-id-map.json` doesn't exist until after the first content upload. This is expected and will be fixed in Step 7.

#### Step 5 — Restore content (first upload)

```bash
yarn restorePrismicContent \
  --snapshot ./restore/snapshot/prismic-snapshot-rewritten.json
```

Or to restore one document type at a time (recommended for large repositories — process high-priority types first):

```bash
yarn restorePrismicContent \
  --snapshot ./restore/snapshot/prismic-snapshot-rewritten.json \
  --type events

yarn restorePrismicContent \
  --snapshot ./restore/snapshot/prismic-snapshot-rewritten.json \
  --type exhibitions
```

The script uploads each document at 1 request/sec and is safe to interrupt and resume — already-created documents will be updated rather than duplicated.

After this completes, the script creates `restore/status/content-id-map.json` which maps old document IDs to new ones. This is needed to fix content relationships in the next steps.

#### Step 6 — Rewrite the snapshot (second pass)

Now that `content-id-map.json` exists, run the transform script again to fix content relationship fields:

```bash
yarn transformSnapshot \
  --source-repo wellcomecollection \
  --target-repo <new-repo-name>
```

This second run will:

- Apply all the same asset ID and URL transformations as before.
- **Additionally** replace old content document IDs with new ones in relationship fields.

#### Step 7 — Restore content (second upload)

Upload the snapshot again with corrected content relationships:

```bash
yarn restorePrismicContent \
  --snapshot ./restore/snapshot/prismic-snapshot-rewritten.json
```

This updates all documents with the correct content relationship references. Documents won't be duplicated — they'll be updated in place using the IDs from `content-id-map.json`.

#### Step 8 — Update hardcoded IDs

Some document IDs are hardcoded in [`/common/data/hardcoded-ids.ts`](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/common/data/hardcoded-ids.ts). After the restore, check `restore/status/content-id-map.json` for the new IDs corresponding to each hardcoded entry and update the file.

> **This requires a code change, PR, merge, and frontend redeploy.** The site will work without it but pages that rely on hardcoded IDs (e.g. the homepage editorial picks) will be broken until the PR is merged and deployed.

Once the PR is merged, delete the `restore/status/` directory — it is gitignored and will be recreated from scratch on the next restore.

#### Step 9 — Point the frontend to the new repo

See [Frontend Cutover Guide](#frontend-cutover-guide).

#### Step 10 — Recreate webhooks and integrations

After cutover recreate any webhooks that were configured in the old repository (build triggers, content-api indexing, cache purge, document unpublish). These are not backed up automatically.

---

### Scenario 2 — Partial Document Loss (repo exists)

**Symptoms:** Repository and media library are intact; some or all documents are missing or corrupted.

Asset IDs in the snapshot are still valid, so no asset upload is needed. Content document IDs are also still valid (documents still in the repo keep their original IDs), so the two-stage content upload process isn't needed. However, `transformSnapshot` should still be run — it backfills `publishDate` on any articles that are recreated (they would otherwise get today's date as their publication date, breaking ordering in list pages).

```bash
cd prismic-model
aws sso login

yarn transformSnapshot

# Restore all types
yarn restorePrismicContent --snapshot ./restore/snapshot/prismic-snapshot-rewritten.json

# Or restore a specific type only
yarn restorePrismicContent --snapshot ./restore/snapshot/prismic-snapshot-rewritten.json --type articles
```

Documents that already exist will be updated (PUT); missing documents will be created (POST). The script is safe to re-run.

> **Note:** Because document IDs in the restored repo are the same as the original, no hardcoded ID updates or content-api reindex are needed.

---

### Scenario 3 — Media Library Loss (repo and content intact)

**Symptoms:** Documents render but asset URLs are broken; images/files return 404.

Follow steps 3–5 from Scenario 1:

1. Upload assets: `yarn restorePrismicAssets`
2. Transform the snapshot: `yarn transformSnapshot --source-repo <name> --target-repo <name>` (use the same name if the repo is unchanged)
3. Restore content from the rewritten snapshot: `yarn restorePrismicContent --snapshot ./restore/snapshot/prismic-snapshot-rewritten.json`

---

### Scenario 4 — Custom Types Lost, Content Intact

**Symptoms:** Documents are accessible via the API; the UI cannot edit them because schemas are missing.

Follow step 2 from Scenario 1 (restore custom types via Slice Machine only). No content or asset restore is needed.

---

## Frontend Cutover Guide

When pointing the frontend at a new or restored repository:

1. Update the repository name in the relevant AWS secrets / environment variables used by the content and identity apps.
2. If the repository name changed, update `repositoryName` in `/common/slicemachine.config.json`.
3. Redeploy the frontend applications.
4. Recreate Prismic webhooks — the unpublish webhook in particular is required for correct content pipeline behaviour.
5. Verify that the content-api indexing is pointing at the new repository.
6. Trigger a full reindex of the content-api. Because Scenario 1 issues new document IDs, the existing index will contain stale entries and search/listing pages may not work correctly until the reindex completes. A full reindex can take 30–60 minutes. The content-api README describes how to trigger one.

---

## Validation Checklist

- [ ] Frontend returns 200 on critical pages (homepage, stories, events, exhibitions).
- [ ] Media loads — no broken images or files.
- [ ] Internal links between documents resolve correctly.
- [ ] Slices render correctly across all page types.
- [ ] Hardcoded IDs in `common/data/hardcoded-ids.ts` have been updated if documents were recreated.
- [ ] Prismic previews work and point to the correct environment URLs.
- [ ] Webhooks are firing (content pipeline, cache purge, search indexing).
- [ ] Access control: only the correct users/roles/tokens have access.
