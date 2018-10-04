// @flow
import {Component} from 'react';
import {getInstallation} from '@weco/common/services/prismic/installations';
import {exhibitionLd} from '@weco/common/utils/json-ld';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import type {Installation} from '@weco/common/model/installations';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';

type Props = {|
  event: Installation
|}

class InstallationPage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    const {id} = context.query;
    const installation = await getInstallation(context.req, id);

    if (installation) {
      return {
        installation,
        title: installation.title,
        description: installation.promoText,
        type: 'installation',
        canonicalUrl: `https://wellcomecollection.org/installations/${installation.id}`,
        imageUrl: installation.image && convertImageUri(installation.image.contentUrl, 800),
        siteSection: 'whatson',
        category: 'public-programme',
        pageJsonLd: exhibitionLd(installation)
      };
    } else {
      return {statusCode: 404};
    }
  }

  render() {
    return <div></div>;
  }
}

export default InstallationPage;
