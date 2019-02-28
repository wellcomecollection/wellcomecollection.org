// @flow
import { spacing, grid, font } from '../../../utils/classnames';
import Divider from '../Divider/Divider';

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
          <div
            className={`${grid({ s: 12, m: 12, l: 12, xl: 12 })} ${spacing(
              { s: 1 },
              { margin: ['bottom'] }
            )}`}
          >
            <Divider extraClasses="divider--dashed" />
          </div>
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
