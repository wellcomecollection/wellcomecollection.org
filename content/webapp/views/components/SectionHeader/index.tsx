import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import { SizeMap } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';

const YellowBox = styled(Space).attrs({
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  display: block;
  width: 60px;
  height: 16px;
  background: ${props => props.theme.color('yellow')};

  ${props => props.theme.media('medium')`
    width: 58px;
  `}

  ${props => props.theme.media('large')`
    width: 64px;
  `}
`;

const Title = styled.h2`
  margin-bottom: 0;

  .bg-dark & {
    color: ${props => props.theme.color('white')};
  }
`;

type Props = {
  title: string;
  gridSize?: SizeMap;
};

const SectionHeader: FunctionComponent<Props> = ({ title, gridSize }) => {
  return (
    <div data-component="section-header" className={font('brand', 2)}>
      <ConditionalWrapper
        condition={!!gridSize}
        wrapper={children => (
          <ContaineredLayout gridSizes={gridSize || gridSize12()}>
            {children}
          </ContaineredLayout>
        )}
      >
        <div>
          <YellowBox />
          <Title>{title}</Title>
        </div>
      </ConditionalWrapper>
    </div>
  );
};

export default SectionHeader;
