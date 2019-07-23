// @flow
import { grid, font } from '../../../utils/classnames';
import Divider from '../Divider/Divider';
import VerticalSpace from '../styled/VerticalSpace';

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
          >
            <Divider extraClasses="divider--dashed" />
          </VerticalSpace>
          <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
            <div>
              <h2 className={`no-margin ${font({ s: 'WB5', m: 'WB4' })}`}>
                {title}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
