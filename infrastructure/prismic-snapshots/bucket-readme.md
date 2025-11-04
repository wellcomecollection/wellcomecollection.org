# Prismic Snapshots

This S3 bucket contains automated daily backups of the Wellcome Collection Prismic content repository.

## What are these files?

These snapshots are complete exports of all content from our Prismic CMS in JSON format

## File naming convention

Files are named with ISO 8601 timestamps:

```
prismic-snapshot-YYYY-MM-DDTHH-MM-SSZ.json
```

For example: `prismic-snapshot-2025-11-03T23-00-00Z.json`

## File format

Each snapshot is a JSON file containing the complete Prismic repository export as returned by the Prismic API. The structure includes:

- `results`: Array of all documents
- `total_results_size`: Total number of documents
- `total_pages`: Number of pages in the export
- Various metadata fields

## Backup schedule

Snapshots are created automatically every day at 11:00 PM UTC by an AWS Lambda function.

## Purpose

These backups serve as:

- **Disaster recovery**: Complete content restoration capability
- **Historical archive**: Point-in-time content snapshots
- **Content analysis**: Data for understanding content evolution
- **Migration support**: Source data for potential CMS migrations

## Retention

Snapshots are retainedfor 14 days.

## Access

To download a snapshot:

```bash
aws s3 cp s3://wellcomecollection-prismic-snapshots/prismic-snapshot-YYYY-MM-DDTHH-MM-SSZ.json .
```

To list all available snapshots:

```bash
aws s3 ls s3://wellcomecollection-prismic-snapshots/
```

## Related documentation

- Main project README: [infrastructure/prismic-snapshots/README.md](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/infrastructure/prismic-snapshots/README.md)
- Lambda source code: [infrastructure/prismic-snapshots/lambda/](https://github.com/wellcomecollection/wellcomecollection.org/tree/main/infrastructure/prismic-snapshots/lambda)
- Terraform infrastructure: [infrastructure/prismic-snapshots/main.tf](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/infrastructure/prismic-snapshots/main.tf)
