// @flow
import { grid, font } from '../../../utils/classnames';
import VerticalSpace from '../styled/VerticalSpace';
import styled from 'styled-components';

const YellowBorder = styled.div`
  position: relative;
  padding-left: 100px;

  &:before {
    position: absolute;
    content: '';
    top: 6px;
    width: 86px;
    left: 0;
    height: 20px;
    background: ${props => props.theme.colors.yellow};
  }
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
          <VerticalSpace
            size="s"
            className={`${grid({ s: 12, m: 12, l: 12, xl: 12 })}`}
          ></VerticalSpace>
          <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
            <YellowBorder>
              <h2 className={`no-margin ${font('wb', 3)}`}>{title}</h2>
            </YellowBorder>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
