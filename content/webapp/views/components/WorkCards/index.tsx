import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { DataGtmProps } from '@weco/common/utils/gtm';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import WorkCard, {
  POPOUT_IMAGE_OFFSET,
} from '@weco/content/views/components/WorkCards/WorkCards.Card';

const WorksList = styled(PlainList)`
  ${props => `
    --gap: ${props.theme.gutter.small};
  `}

  ${props =>
    props.theme.media('sm')(`
    --gap: ${props.theme.gutter.medium};
  `)}

  ${props =>
    props.theme.media('md')(`
    --gap: ${props.theme.gutter.large};
  `)}

  ${props =>
    props.theme.media('lg')(`
    --gap: ${props.theme.gutter.xlarge};
  `)}

  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--gap);
`;

const WorkContainer = styled.li<{ $columns: 3 | 4 }>`
  flex: 0 0 calc(100% - var(--gap));

  ${props =>
    props.theme.media('sm')(`
    flex: 0 0 calc(50% - var(--gap));
  `)}

  ${props =>
    props.theme.media('md')(`
    flex: 0 0 calc(100% / ${props.$columns} - var(--gap));
  `)}
`;

type Props = {
  works: WorkBasic[];
  dataGtmProps: Pick<DataGtmProps, 'category-label'>;
  columns?: 3 | 4;
};

const WorkCards: FunctionComponent<Props> = ({
  works,
  dataGtmProps,
  columns = 4,
}) => {
  if (works.length === 0) return null;

  return (
    <Space
      data-component="work-cards"
      $v={{ size: POPOUT_IMAGE_OFFSET, properties: ['padding-top'] }}
    >
      {works.length === 1 ? (
        <WorkCard
          item={works[0]}
          dataGtmProps={{
            'position-in-list': '1',
            'category-label': dataGtmProps['category-label'],
          }}
        />
      ) : (
        <WorksList>
          {works.map((item, index) => (
            <WorkContainer key={item.id} $columns={columns}>
              <WorkCard
                item={item}
                dataGtmProps={{
                  'position-in-list': `${index + 1}`,
                  'category-label': dataGtmProps['category-label'],
                }}
              />
            </WorkContainer>
          ))}
        </WorksList>
      )}
    </Space>
  );
};

export default WorkCards;
