import { NextPage } from 'next';

import { getServerData } from '@weco/common/server-data';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchBook } from '@weco/content/services/prismic/fetch/books';
import { transformBook } from '@weco/content/services/prismic/transformers/books';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import BookPage, {
  Props as BookPageProps,
} from '@weco/content/views/pages/books/book';

const Page: NextPage<BookPageProps> = props => {
  return <BookPage {...props} />;
};

type Props = ServerSideProps<BookPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const { bookId } = context.query;

  if (!looksLikePrismicId(bookId)) {
    return { notFound: true };
  }
  const client = createClient(context);
  const bookDocument = await fetchBook(client, bookId);

  if (isNotUndefined(bookDocument)) {
    const serverData = await getServerData(context);
    const book = transformBook(bookDocument);

    return {
      props: serialiseProps<Props>({
        book,
        serverData,
      }),
    };
  }

  return { notFound: true };
};

export default Page;
