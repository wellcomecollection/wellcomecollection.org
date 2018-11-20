// @flow
import {Fragment, Component} from 'react';
import {getBook} from '@weco/common/services/prismic/books';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import Body from '@weco/common/views/components/Body/Body';
import PrimaryLink from '@weco/common/views/components/Links/PrimaryLink/PrimaryLink';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import {UiImage} from '@weco/common/views/components/Images/Images';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import {defaultContributorImage} from '@weco/common/services/prismic/parsers';
import {spacing, grid} from '@weco/common/utils/classnames';
import type {Book} from '@weco/common/model/books';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';

type Props = {|
  book: Book
|}

// FIXME: This is nonsense
const BookMetadata = ({book}: Props) => (
  <dl className='grid'>
    {book.datePublished &&
      <Fragment>
        <dt className={'no-margin ' + grid({ s: 4, m: 4, l: 4, xl: 4 })}>Date published</dt>
        <dd className={'no-margin ' + grid({ s: 8, m: 8, l: 8, xl: 8 })}>
          {book.datePublished && <HTMLDate date={new Date(book.datePublished)} />}
        </dd>
      </Fragment>
    }
    <dt className={'no-margin ' + grid({ s: 4, m: 4, l: 4, xl: 4 })}>Format</dt>
    <dd className={'no-margin ' + grid({ s: 8, m: 8, l: 8, xl: 8 })}>{book.format}</dd>

    <dt className={'no-margin ' + grid({ s: 4, m: 4, l: 4, xl: 4 })}>Extent</dt>
    <dd className={'no-margin ' + grid({ s: 8, m: 8, l: 8, xl: 8 })}>{book.extent}</dd>

    <dt className={'no-margin ' + grid({ s: 4, m: 4, l: 4, xl: 4 })}>ISBN</dt>
    <dd className={'no-margin ' + grid({ s: 8, m: 8, l: 8, xl: 8 })}>{book.isbn}</dd>
  </dl>
);

export class ArticleSeriesPage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    const {id} = context.query;
    const book = await getBook(context.req, id);

    if (book) {
      return {
        book,
        title: book.title,
        description: book.promoText,
        type: 'books',
        canonicalUrl: `https://wellcomecollection.org/books/${book.id}`,
        imageUrl: book.image && convertImageUri(book.image.contentUrl, 800),
        siteSection: 'books',
        analyticsCategory: 'books'
      };
    } else {
      return {statusCode: 404};
    }
  }

  render() {
    const {book} = this.props;
    const image = book.promo && book.promo.image;
    const tasl = image && {
      isFull: false,
      contentUrl: image.contentUrl,
      title: image.title,
      author: image.author,
      sourceName: image.source && image.source.name,
      sourceLink: image.source && image.source.link,
      license: image.license,
      copyrightHolder: image.copyright && image.copyright.holder,
      copyrightLink: image.copyright && image.copyright.link
    };
    // $FlowFixMe
    const FeaturedMedia = book.cover && <UiImage tasl={tasl} extraClasses='margin-h-auto width-auto max-height-70vh' {...book.cover} />;
    const breadcrumbs = {
      items: [
        {
          text: 'Books',
          url: '/books'
        },
        {
          url: `/books/${book.id}`,
          text: book.title,
          isHidden: true
        }
      ]
    };
    const Header = <PageHeader
      breadcrumbs={breadcrumbs}
      labels={null}
      title={book.title}
      FeaturedMedia={FeaturedMedia}
      ContentTypeInfo={
        <Fragment>
          {book.authorName && <p className='no-margin'>{book.authorName}</p>}
        </Fragment>
      }
      HeroPicture={null}
      Background={null}
    />;

    // TODO: (drupal migration) we can drop reading the text fields once we've
    // migrated the content over
    const drupalPerson = book.authorName && {
      type: 'people',
      id: 'xxx',
      name: book.authorName || '',
      image: book.authorImage ? {
        contentUrl: book.authorImage || '',
        width: 800,
        height: 0,
        alt: `Image of ${book.authorName}`,
        tasl: {
          sourceName: 'Unknown',
          title: null,
          author: null,
          sourceLink: null,
          license: null,
          copyrightHolder: null,
          copyrightLink: null
        },
        crops: {}
      } : defaultContributorImage,
      twitterHandle: null,
      // parse this as string
      description: book.authorDescription,
      sameAs: []
    };
    const drupalContributor = drupalPerson && {
      contributor: drupalPerson,
      description: null,
      role: {
        id: 'WcUWeCgAAFws-nGh',
        title: 'Author'
      }
    };
    const contributors = book.contributors.length > 0 ? book.contributors
      : drupalContributor ? [drupalContributor] : [];

    return (
      <ContentPage
        id={book.id}
        Header={Header}
        Body={<Body body={book.body} />}
        contributorProps={{contributors}}
      >
        <Fragment>
          <div className={`${spacing({s: 2}, {padding: ['top']})} ${spacing({s: 2}, {margin: ['top']})} border-top-width-1 border-color-smoke`}>
            <BookMetadata book={book} />
          </div>
          {book.orderLink && <PrimaryLink url={book.orderLink} name='Order online' />}
        </Fragment>
      </ContentPage>
    );
  }
};

export default PageWrapper(ArticleSeriesPage);
