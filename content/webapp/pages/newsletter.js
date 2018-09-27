// @flow
import {Component} from 'react';
import NewsletterSignup from '@weco/common/views/components/NewsletterSignup/NewsletterSignup';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import {spacing, grid} from '@weco/common/utils/classnames';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';
type Props = {|
  result: ?string
|}
export class NewsletterPage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    const {result} = context.query;
    return {
      title: 'Newsletter',
      description: 'Sign up for news and information from Wellcome Collection',
      type: 'website',
      canonicalUrl: `https://wellcomecollection.org/newsletter`,
      imageUrl: 'https://iiif.wellcomecollection.org/image/V0019283.jpg/full/800,/0/default.jpg',
      siteSection: 'what-we-do',
      analyticsCategory: 'information',
      result
    };
  }
  render() {
    const {result} = this.props;
    return (
      <div className={spacing({s: 4}, {margin: ['top']})}>
        <div className={`row ${spacing({s: 8}, {padding: ['bottom']})}`}>
          <div className='container'>
            <div className='grid'>
              <div className={grid({s: 12, m: 10, shiftM: 1, l: 8,  shiftL: 2, xl: 8, shiftXL: 2})}>
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
    );
  }
}

export default PageWrapper(NewsletterPage);
