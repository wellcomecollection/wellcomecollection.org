// @flow
import type { Context } from 'next';
import { Component } from 'react';
import NewsletterSignup from '@weco/common/views/components/NewsletterSignup/NewsletterSignup';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { spacing, grid } from '@weco/common/utils/classnames';

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
        url={{ pathname: `/newsletter` }}
        jsonLd={{ '@type': 'WebPage' }}
        openGraphType={'website'}
        siteSection={'what-we-do'}
        imageUrl={
          'https://iiif.wellcomecollection.org/image/V0019283.jpg/full/800,/0/default.jpg'
        }
        imageAltText={''}
      >
        <div className={spacing({ s: 4 }, { margin: ['top'] })}>
          <div className={`row ${spacing({ s: 8 }, { padding: ['bottom'] })}`}>
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
          </div>
        </div>
      </PageLayout>
    );
  }
}

export default NewsletterPage;
