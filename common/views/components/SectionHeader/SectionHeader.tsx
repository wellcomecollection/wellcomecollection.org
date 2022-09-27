import { FC } from 'react';
import { grid, font } from '../../../utils/classnames';
import Space from '../styled/Space';
import styled from 'styled-components';

const YellowBox = styled.div`
  display: inline-block;
  width: 60px;
  height: 18px;
  background: ${props => props.theme.color('yellow')};

  ${props => props.theme.media.medium`
    width: 58px;
  `}

  ${props => props.theme.media.large`
    width: 64px;
    height: 19px;
  `}
`;

const TitleWrapper = styled.span`
  .bg-neutral-700 & {
    color: ${props => props.theme.color('white')};
  }
`;

type Props = {
  title: string;
};

const SectionHeader: FC<Props> = ({ title }) => {
  return (
    <div className={`row ${font('wb', 2)}`}>
      <div className="container">
        <div className="grid">
          <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
            <YellowBox />
            <Space
              as="h2"
              h={{ size: 's', properties: ['margin-left'] }}
              className="inline"
            >
              <TitleWrapper>{title}</TitleWrapper>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
