import * as prismic from '@prismicio/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { createClient as createPrismicClient } from '@weco/common/services/prismic/fetch';
import linkResolver from '@weco/common/services/prismic/link-resolver';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Kill any cookie we had set, as we think it is causing issues.
    res.setHeader(
      'Set-Cookie',
      `${prismic.cookie.preview}=; Path=/; Max-Age=0`
    );

    const client = createPrismicClient();

    // Enable auto previews from request
    const cookies = req.headers.cookie || '';
    const previewRef = cookies
      .split(';')
      .find(c => c.trim().startsWith(`${prismic.cookie.preview}=`))
      ?.split('=')[1];

    if (previewRef) {
      client.queryContentFromRef(previewRef);
    }

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

    // Set the preview cookie
    res.setHeader('Set-Cookie', `isPreview=true; Path=/; HttpOnly=false`);

    // Redirect to the resolved URL
    res.redirect(307, url);
  } catch (error) {
    console.error('Error in preview handler:', error);
    res.redirect(307, '/');
  }
};

export default handler;
