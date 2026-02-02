import * as prismic from '@prismicio/client';
import * as apm from 'elastic-apm-node';
import { NextApiRequest, NextApiResponse } from 'next';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { createClient } from '@weco/content/services/prismic/fetch';

/**
 * Prismic Preview API Handler
 *
 * This Next.js API route handles preview requests from Prismic CMS.
 *
 * ## How Prismic previews work:
 * 1. User clicks "Preview" in Prismic dashboard
 * 2. Prismic redirects to this endpoint with preview tokens in the URL query params
 * 3. This handler resolves the preview URL using Prismic's API via `resolvePreviewURL()`
 * 4. Prismic's SDK automatically sets the 'io.prismic.preview' cookie with the preview ref
 * 5. We set our own 'isPreview=true' cookie for app-level preview mode detection
 * 6. Redirects user to the actual preview content
 *
 * ## Cookie management:
 * - Prismic SDK sets 'io.prismic.preview' cookie containing the preview ref token
 * - We set 'isPreview=true' cookie with httpOnly=false (for client-side preview detection)
 *
 * ## Related files:
 * - middleware.ts - Also sets 'isPreview' cookie for preview.* subdomains
 * - services/prismic/link-resolver - Converts Prismic docs to URLs
 * - services/prismic/fetch/index.ts - createClient calls enableAutoPreviewsFromReq()
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { client } = createClient({ req });

    /**
     * This is because the types in api.resolve are not accurate.
     */
    type LinkResolverArg = Parameters<typeof linkResolver>[0];

    const retypedLinkResolver: prismic.LinkResolverFunction = doc => {
      // `@prismicio/client` types allow `uid: string | null`.
      // Our `linkResolver` expects `uid?: string`.
      const maybeDoc = doc as unknown as {
        uid?: string | null;
        type?: string;
        tags?: unknown;
        data?: unknown;
      };

      const uid = typeof maybeDoc.uid === 'string' ? maybeDoc.uid : undefined;
      const type = typeof maybeDoc.type === 'string' ? maybeDoc.type : '';
      const tags = Array.isArray(maybeDoc.tags)
        ? maybeDoc.tags.filter((t): t is string => typeof t === 'string')
        : undefined;

      const data =
        maybeDoc.data && typeof maybeDoc.data === 'object'
          ? (maybeDoc.data as { relatedDocument?: unknown })
          : undefined;

      const relatedDocument =
        data?.relatedDocument && typeof data.relatedDocument === 'object'
          ? (data.relatedDocument as { uid?: unknown; type?: unknown })
          : undefined;

      const linkResolverArg: LinkResolverArg = {
        uid,
        type,
        tags,
        data:
          relatedDocument &&
          typeof relatedDocument.uid === 'string' &&
          typeof relatedDocument.type === 'string'
            ? {
                relatedDocument: {
                  uid: relatedDocument.uid,
                  type: relatedDocument.type,
                },
              }
            : undefined,
      };

      return linkResolver(linkResolverArg) || '/';
    };

    const url = await client.resolvePreviewURL({
      linkResolver: retypedLinkResolver,
      defaultURL: '/',
    });

    // Set the isPreview cookie if not already present
    // This cookie is used by our application to enable preview mode
    const hasIsPreviewCookie = typeof req.cookies?.isPreview === 'string';

    if (!hasIsPreviewCookie) {
      res.setHeader('Set-Cookie', `isPreview=true; Path=/; HttpOnly=false`);
    }
    // Redirect to the resolved URL
    res.redirect(307, url);
  } catch (error) {
    apm.captureError(error);
    console.error('Error in preview handler:', error);
    res.redirect(307, '/');
  }
};

export default handler;
