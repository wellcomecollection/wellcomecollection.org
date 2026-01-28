import * as prismic from '@prismicio/client';
import * as apm from 'elastic-apm-node';
import { NextApiRequest, NextApiResponse } from 'next';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { createClient } from '@weco/content/services/prismic/fetch';

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

    // Kill any cookie we had set, as we think it is causing issues.
    // Note: historically this was done in the Koa server with `ctx.cookies.set(prismic.cookie.preview)`.
    // We preserve that behaviour by overwriting the cookie with an empty value (without Max-Age=0).
    // This should clear legacy/invalid values without explicitly expiring the cookie.
    const killPrismicPreviewCookie = `${prismic.cookie.preview}=; Path=/;`;

    const hasIsPreviewCookie = typeof req.cookies?.isPreview === 'string';

    res.setHeader(
      'Set-Cookie',
      !hasIsPreviewCookie
        ? [killPrismicPreviewCookie, `isPreview=true; Path=/; HttpOnly=false`]
        : [killPrismicPreviewCookie]
    );
    // Redirect to the resolved URL
    res.redirect(307, url);
  } catch (error) {
    apm.captureError(error);
    console.error('Error in preview handler:', error);
    res.redirect(307, '/');
  }
};

export default handler;
