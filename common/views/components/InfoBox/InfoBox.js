// @flow
import { Fragment } from 'react';
import { spacing, font, classNames } from '../../../utils/classnames';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import Icon from '../Icon/Icon';
import type { Element } from 'react';
import type { LabelField } from '../../../model/label-field';
import VerticalSpace from '../styled/VerticalSpace';

type Props = {|
  title: string,
  items: {|
    ...LabelField,
    icon?: ?string,
  |}[],
  children: Element<'p'>,
|};

const InfoBox = ({ title, items, children }: Props) => {
  return (
    <Fragment>
      <h2 className="h2">{title}</h2>
      <VerticalSpace
        size="l"
        properties={['padding-top', 'padding-bottom']}
        className={classNames({
          'bg-yellow': true,
          [spacing({ s: 4 }, { padding: ['right', 'left'] })]: true,
        })}
      >
        {items.map(({ title, description, icon }, i) => (
          <Fragment key={i}>
            <div className={font('hnm', 4)}>
              {icon && (title || description) && (
                <span
                  className={`float-l ${spacing(
                    { s: 1 },
                    { margin: ['right'] }
                  )}`}
                >
                  <Icon name={icon} />
                </span>
              )}
              {title && (
                <h3 className={classNames([font('hnm', 5)])}>{title}</h3>
              )}
              {description && (
                <VerticalSpace
                  size="m"
                  className={classNames({
                    [font('hnl', 5)]: true,
                    'first-para-no-margin': true,
                  })}
                >
                  <PrismicHtmlBlock html={description} />
                </VerticalSpace>
              )}
            </div>
          </Fragment>
        ))}
        {children}
      </VerticalSpace>
    </Fragment>
  );
};

export default InfoBox;
