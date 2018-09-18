// @flow
import {Fragment} from 'react';
import {spacing, font, classNames} from '../../../utils/classnames';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import Icon from '../Icon/Icon';
import type {Element} from 'react';
import type {LabelField} from '../../../model/label-field';

type Props = {|
  title: string,
  items: {|
    ...LabelField,
    icon?: ?string
  |}[],
  children: Element<'p'>
|}

const InfoBox = ({
  title,
  items,
  children
}: Props) => {
  return (
    <Fragment>
      <h2 className='h2'>{title}</h2>
      <div className={classNames({
        'bg-yellow': true,
        [spacing({s: 4}, {padding: ['top', 'right', 'bottom', 'left']})]: true,
        [spacing({s: 4}, {margin: ['bottom']})]: true
      })}>
        {items.map(({title, description, icon}, i) =>
          <Fragment key={i}>
            <div className={font({s: 'HNM4'})}>
              {icon && (title || description) &&
                <span className={`float-l ${spacing({s: 1}, {margin: ['right']})}`}>
                  <Icon name={icon} />
                </span>
              }
              {title &&
                <h3 className={classNames([
                  font({s: 'HNM4'}),
                  spacing({s: 0}, {margin: ['top']})
                ])}>{title}</h3>
              }
              {description &&
                <div className={classNames([
                  'plain-text',
                  font({s: 'HNL4'}),
                  spacing({s: 4}, {margin: ['bottom']})
                ])}>
                  <PrismicHtmlBlock html={description} />
                </div>
              }
            </div>
          </Fragment>
        )}
        <div className={spacing({s: 4}, {margin: ['bottom']})}>
          {children}
        </div>
      </div>
    </Fragment>
  );
};

export default InfoBox;
