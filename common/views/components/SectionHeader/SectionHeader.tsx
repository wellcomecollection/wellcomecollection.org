import { FunctionComponent } from 'react';
import { font } from '../../../utils/classnames';
import Space from '../styled/Space';
import styled from 'styled-components';
import Layout12 from '../Layout12/Layout12';

const YellowBox = styled.div`
  display: inline-block;
  width: 60px;
  height: 18px;
  background: ${props => props.theme.color('yellow')};

  ${props => props.theme.media('medium')`
    width: 58px;
  `}

  ${props => props.theme.media('large')`
    width: 64px;
    height: 19px;
  `}
`;

const TitleWrapper = styled(Space).attrs({
  h: { size: 's', properties: ['margin-left'] },
})`
  display: inline;
`;

const Title = styled.span`
  .bg-dark & {
    color: ${props => props.theme.color('white')};
  }
`;

type Props = {
  title: string;
};

const SectionHeader: FunctionComponent<Props> = ({ title }) => {
  return (
    <div className={font('wb', 2)}>
      <Layout12>
        <YellowBox />
        <TitleWrapper as="h2">
          <Title>{title}</Title>
        </TitleWrapper>
      </Layout12>
    </div>
  );
};

export default SectionHeader;
