// @flow
import PageLayout from '../PageLayout/PageLayout';
import ContentPage from '../ContentPage/ContentPage';
import PageHeader from '../PageHeader/PageHeader';
import Body from '../Body/Body';
import MoreLink from '../MoreLink/MoreLink';
import VerticalSpace from '../styled/VerticalSpace';

type Props = {|
  statusCode: number,
  title?: ?string,
|};

const ErrorPage = ({ statusCode, title }: Props) => {
  return (
    <PageLayout
      title={`${statusCode}`}
      description={`${statusCode}`}
      url={{ pathname: `/` }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType={'website'}
      siteSection={'stories'}
      imageUrl={null}
      imageAltText={null}
    >
      <ContentPage
        id={'error'}
        Header={
          <PageHeader
            breadcrumbs={{ items: [] }}
            labels={null}
            title={
              title ||
              'This isn’t the page you’re looking for, but how about these?'
            }
            ContentTypeInfo={null}
            Background={null}
            backgroundTexture={
              'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg'
            }
            FeaturedMedia={null}
            HeroPicture={null}
            highlightHeading={true}
          />
        }
        Body={<Body body={[]} pageId={'error'} />}
      >
        <div className="body-text">
          <VerticalSpace as="ul" size="xl">
            <VerticalSpace size="l" as="li">
              <MoreLink url="/whats-on" name="Our exhibitions and events" />
            </VerticalSpace>
            <VerticalSpace size="l" as="li">
              <MoreLink url="https://wellcomelibrary.org" name="Our library" />
            </VerticalSpace>
            <VerticalSpace size="l" as="li">
              <MoreLink url="/stories" name="Our stories" />
            </VerticalSpace>
            <VerticalSpace size="l" as="li">
              <MoreLink url="/books" name="Our books" />
            </VerticalSpace>
            <VerticalSpace size="l" as="li">
              <MoreLink url="/works" name="Our images" />
            </VerticalSpace>
            <li size="l" as="li">
              <MoreLink
                url="/pages/Wuw2MSIAACtd3Ssg"
                name="Our youth programme"
              />
            </li>
          </VerticalSpace>

          <div>
            <h2 className="h2">Looking for something published before 2018?</h2>
            <p>
              Our websites have been archived by the{' '}
              <a href="https://archive.org">Internet Archive</a> in its{' '}
              <a href="https://web.archive.org/">Wayback Machine</a>.
            </p>
            <VerticalSpace size="l">
              <MoreLink
                url="https://web.archive.org/web/*/wellcomecollection.org"
                name="See the Wellcome Collection website from 2007-present"
              />
            </VerticalSpace>
            <VerticalSpace size="l">
              <MoreLink
                url="https://web.archive.org/web/*/blog.wellcomecollection.org"
                name="Read blog posts from 2013-2017"
              />
            </VerticalSpace>
          </div>

          <div>
            <p>
              If you{`'`}re looking for something specific you{`'`}d love to see
              return to this website, email us at{' '}
              <a href="mailto:digital@wellcomecollection.org">
                digital@wellcomecollection.org
              </a>
              .
            </p>
          </div>
        </div>
      </ContentPage>
    </PageLayout>
  );
};

export default ErrorPage;
