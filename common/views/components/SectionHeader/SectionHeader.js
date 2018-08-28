// @flow
import {spacing, grid, font, classNames} from '../../../utils/classnames';
import Divider from '../Divider/Divider';
import PrimaryLink from '../Links/PrimaryLink/PrimaryLink';

type Props = {|
  title: string,
  linkText?: string,
  linkUrl?: string
|}

// TODO: Allow the component to take a PrimaryLink as a prop
// (not possible while we're using it in Nunjucks land).

const SectionHeader = ({title, linkText, linkUrl}: Props) => {
  return (
    <div className={`row ${spacing({s: 6}, {margin: ['bottom']})} ${spacing({s: 8, m: 10}, {margin: ['top']})} `}>
      <div className='container'>
        <div className='grid'>
          <div className={`${grid({s: 12, m: 12, l: 12, xl: 12})} ${spacing({s: 1}, {margin: ['bottom']})}`}>
            <Divider extraClasses='divider--dashed' />
          </div>
          <div className={grid({s: 12, m: 12, l: 12, xl: 12})}>
            <div className={`${spacing({s: 1, l: 4}, {margin: ['bottom']})} flex-l-up flex--v-end flex--h-space-between`}>
              <h2 className={`${font({s: 'WB5', m: 'WB4'})} ${spacing({l: 1}, {padding: ['right']})} ${spacing({s: 0}, {margin: ['top']})} ${spacing({s: 0}, {margin: ['bottom']})}`}>{title}</h2>
              {linkText && linkUrl &&
                <PrimaryLink name={linkText} url={linkUrl} />
              }
              {linkText && !linkUrl &&
                <span className={classNames({
                  [font({s: 'HNM5', m: 'HNM4'})]: true
                })}>{linkText}</span>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
