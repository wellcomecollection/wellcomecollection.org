// @flow
import type { Context } from 'next';
import { Component } from 'react';
import NewsletterSignup from '@weco/common/views/components/NewsletterSignup/NewsletterSignup';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { grid } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

type Props = {|
  result: ?string,
|};
export class NewsletterPage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const { result } = ctx.query;

    return {
      result,
    };
  };
  render() {
    const { result } = this.props;

    return (
      <PageLayout
        title={'Sign up to our newsletter'}
        description={
          'Sign up for news and information from Wellcome Collection'
        }
        hideNewsletterPromo={true}
        url={{ pathname: `/newsletter` }}
        jsonLd={{ '@type': 'WebPage' }}
        openGraphType={'website'}
        siteSection={'what-we-do'}
        imageUrl={
          'https://iiif.wellcomecollection.org/image/V0019283.jpg/full/800,/0/default.jpg'
        }
        imageAltText={''}
      >
        <PageHeader
          breadcrumbs={{ items: [] }}
          labels={null}
          title={'Newsletters'}
          ContentTypeInfo={null}
          Background={null}
          backgroundTexture={
            'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg'
          }
          FeaturedMedia={null}
          HeroPicture={null}
          highlightHeading={true}
        />

        <Space v={{ size: 'xl', properties: ['margin-top'] }}>
          <Space
            v={{
              size: 'xl',
              properties: ['padding-bottom'],
            }}
            className={`row`}
          >
            <div className="container">
              <div className="grid">
                <div
                  className={grid({
                    s: 12,
                    m: 10,
                    shiftM: 1,
                    l: 8,
                    shiftL: 2,
                    xl: 8,
                    shiftXL: 2,
                  })}
                >
                  <NewsletterSignup
                    isSuccess={result === 'success'}
                    isError={result === 'error'}
                    isConfirmed={result === 'confirmed'}
                  />
                </div>
              </div>
            </div>
          </Space>
        </Space>
      </PageLayout>
    );
  }
}

export default NewsletterPage;
