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
    icon?: string
  |}[],
  children: Element<'p'>
|}

const InfoBox = ({
  title,
  items,
  children
}: Props) => (
  <div className={classNames([
    'bg-yellow',
    spacing({s: 4}, {padding: ['top', 'right', 'bottom', 'left']}),
    spacing({s: 4}, {margin: ['top', 'bottom']})
  ])}>
    <h2 className='h2'>{title}</h2>

    {items.map(({title, description, icon}) =>
      <Fragment key={title}>
        {!icon && <h3 className={font({s: 'HNM4'})}>{title}</h3>}
        {icon &&
          <h3 className={classNames([
            'no-margin flex flex--v-center',
            font({s: 'HNM4'})
          ])}>
            <span className={classNames([
              'flex flex--v-center',
              spacing({s: 1}, {margin: ['right']})
            ])}>
              <Icon name={icon} />
            </span>
            <span>{title}</span>
          </h3>}
        {description &&
          <div className={classNames([
            'plain-text',
            font({s: 'HNL4'}),
            spacing({s: 4}, {margin: ['bottom']})
          ])}>
            <PrismicHtmlBlock html={description} />
          </div>
        }
      </Fragment>
    )}

    {children}
  </div>
);

export default InfoBox;
