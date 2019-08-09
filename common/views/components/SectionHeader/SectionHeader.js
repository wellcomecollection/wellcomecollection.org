// @flow
import { grid, font } from '../../../utils/classnames';
import Space from '../styled/Space';
import styled from 'styled-components';

const YellowBox = styled.div`
  display: inline-block;
  width: 60px;
  height: 20px;
  background: ${props => props.theme.colors.yellow};
`;

type Props = {|
  title: string,
|};

// TODO: Allow the component to take a MoreLink as a prop
// (not possible while we're using it in Nunjucks land).

const SectionHeader = ({ title }: Props) => {
  return (
    <div className={`row`}>
      <div className="container">
        <div className="grid">
          <Space
            v={{
              size: 's',
              properties: ['margin-bottom'],
            }}
            className={`${grid({ s: 12, m: 12, l: 12, xl: 12 })}`}
          ></Space>
          <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
            <YellowBox />
            <Space
              as="h2"
              h={{ size: 's', properties: ['margin-left'] }}
              className={`inline no-margin ${font('wb', 3)}`}
            >
              {title}
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
