// @flow
import type { Context } from 'next';
import { Component } from 'react';
import { getExhibitions } from '@weco/common/services/prismic/exhibitions';
import { exhibitionLd } from '@weco/common/utils/json-ld';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import LayoutPaginatedResults from '@weco/common/views/components/LayoutPaginatedResults/LayoutPaginatedResults';
import type { UiExhibition } from '@weco/common/model/exhibitions';
import type { Period } from '@weco/common/model/periods';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';

type Props = {|
  exhibitions: PaginatedResults<UiExhibition>,
  period: ?Period,
  displayTitle: string,
|};

const pageDescription =
  'Explore the connections between science, medicine, life and art through our permanent and temporary exhibitions. Admission is always free.';
export class ExhibitionsPage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const { page = 1 } = ctx.query;
    const { period } = ctx.query;
    const exhibitions = await getExhibitions(ctx.req, { page, period });
    if (exhibitions && exhibitions.results.length > 0) {
      const title = (period === 'past' ? 'Past e' : 'E') + 'xhibitions';
      return {
        exhibitions,
        displayTitle: title,
        period,
      };
    } else {
      return { statusCode: 404 };
    }
  };

  render() {
    const { exhibitions, period, displayTitle } = this.props;
    const firstExhibition = exhibitions[0];

    return (
      <PageLayout
        title={displayTitle}
        description={pageDescription}
        url={{ pathname: `/exhibitions${period ? `/${period}` : ''}` }}
        jsonLd={exhibitions.results.map(exhibitionLd)}
        openGraphType={'website'}
        siteSection={'whats-on'}
        imageUrl={
          firstExhibition &&
          firstExhibition.image &&
          convertImageUri(firstExhibition.image.contentUrl, 800)
        }
        imageAltText={
          firstExhibition && firstExhibition.image && firstExhibition.image.alt
        }
      >
        <SpacingSection>
          <LayoutPaginatedResults
            showFreeAdmissionMessage={true}
            title={displayTitle}
            description={[
              {
                type: 'paragraph',
                text: pageDescription,
                spans: [],
              },
            ]}
            paginatedResults={exhibitions}
            paginationRoot={`exhibitions${period ? `/${period}` : ''}`}
          />
        </SpacingSection>
      </PageLayout>
    );
  }
}

export default ExhibitionsPage;
