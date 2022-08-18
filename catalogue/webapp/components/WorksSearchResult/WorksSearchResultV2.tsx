import { FC } from 'react';
import styled from 'styled-components';

// Types
import { Work } from '@weco/common/model/catalogue';

// Helpers/Utils
import { classNames, font } from '@weco/common/utils/classnames';
import {
  getArchiveLabels,
  getProductionDates,
  getCardLabels,
} from '../../utils/works';
import { trackEvent } from '@weco/common/utils/ga';
import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';

// Components
import Space from '@weco/common/views/components/styled/Space';
import LinkLabels from '@weco/common/views/components/LinkLabels/LinkLabels';
import WorkTitle from '../WorkTitle/WorkTitle';
import WorkLink from '@weco/common/views/components/WorkLink/WorkLink';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';

type Props = {
  work: Work;
  resultPosition: number;
};

const Container = styled.div`
  ${props => props.theme.media.medium`
    display: flex;
  `}
`;
const Preview = styled(Space)`
  height: 120px;
  width: 120px;
  margin-bottom: ${props => props.theme.spacingUnit * 2}px;
  margin-right: 1rem;
  position: relative;
  text-align: center;
  background-color: ${props => props.theme.color('black')};

  ${props => props.theme.media.medium`
    margin-bottom: 0;
  `}
`;
const Details = styled.div`
  ${props => props.theme.media.medium`
    max-width: 900px;
  `}
`;
const WorkInformation = styled.div`
  display: flex;
  color: ${props => props.theme.color('pewter')};
`;
const WorkTitleHeading = styled.h3`
  margin-bottom: 0.5rem;
`;

// TODO: remove, hack to handle the fact that we are pulling through PDF thumbnails.
// These will be removed from the API at some stage.
function isPdfThumbnail(thumbnail): boolean {
  // e.g. https://dlcs.io/iiif-img/wellcome/5/b28820769_WG_2006_PAAG-implementing-persistent-identifiers_EN.pdf/full/!200,200/0/default.jpg
  return Boolean(thumbnail.url.match('.pdf/full'));
}

const WorkSearchResultV2: FC<Props> = ({ work, resultPosition }: Props) => {
  const productionDates = getProductionDates(work);
  const archiveLabels = getArchiveLabels(work);
  const cardLabels = getCardLabels(work);

  const primaryContributorLabel = work.contributors.find(
    contributor => contributor.primary
  )?.agent.label;

  return (
    <WorkLink
      id={work.id}
      resultPosition={resultPosition}
      source={`works_search_result`}
      passHref
    >
      <Space
        as="a"
        v={{
          size: 'l',
          properties: ['padding-top', 'padding-bottom'],
        }}
        className={classNames({
          'plain-link': true,
          block: true,
          'card-link': true,
        })}
        onClick={() => {
          // We've left `WorkCard` here for legacy tracking.
          // We don't really use it.
          trackEvent({
            category: 'WorkCard',
            action: 'follow link',
            label: work.id,
          });
        }}
      >
        <Container>
          {work.thumbnail && !isPdfThumbnail(work.thumbnail) && (
            <Preview>
              <img
                style={{
                  width: 'auto',
                  height: '110px',
                  marginTop: '5px',
                }}
                alt={`view ${work.title}`}
                src={convertIiifImageUri(work.thumbnail.url, 120)}
              />
            </Preview>
          )}
          <Details>
            <Space
              v={{
                size: 's',
                properties: ['margin-bottom'],
              }}
            >
              <LabelsList labels={cardLabels} defaultLabelColor="cream" />
            </Space>
            <WorkTitleHeading
              className={classNames({
                [font('intb', 4)]: true,
                'card-link__title': true,
              })}
            >
              <WorkTitle title={work.title} />
            </WorkTitleHeading>

            <WorkInformation>
              {productionDates.length > 0 && (
                <LinkLabels
                  items={[
                    {
                      text: productionDates[0],
                      url: null,
                    },
                  ]}
                />
              )}
              {primaryContributorLabel && (
                <>
                  |
                  <Space
                    h={{
                      size: 's',
                      properties: ['margin-left'],
                    }}
                  >
                    <LinkLabels
                      items={[
                        {
                          text: primaryContributorLabel,
                        },
                      ]}
                    />
                  </Space>
                </>
              )}
            </WorkInformation>
            {archiveLabels?.reference && (
              <LinkLabels
                heading="Reference"
                items={[{ text: archiveLabels.reference }]}
              />
            )}
            {archiveLabels?.partOf && (
              <LinkLabels
                heading="Part of"
                items={[{ text: archiveLabels.partOf }]}
              />
            )}
          </Details>
        </Container>
      </Space>
    </WorkLink>
  );
};
export default WorkSearchResultV2;
