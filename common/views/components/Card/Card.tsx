import { Card as CardType } from '@weco/common/model/card';
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import { UiImage } from '../Images/Images';
import LabelsList from '../LabelsList/LabelsList';

import Space from '../styled/Space';
import styled from 'styled-components';
import { FunctionComponent } from 'react';
import PartNumberIndicator from '../PartNumberIndicator/PartNumberIndicator';

type Props = {
  item: CardType;
};

export const CardOuter = styled.a.attrs(() => ({
  className:
    'plain-link promo-link rounded-corners overflow-hidden flex-ie-block flex--column',
}))`
  background: ${props => props.theme.color('cream')};

  .card-theme.card-theme--white & {
    background: ${props => props.theme.color('white')};
  }

  .card-theme.card-theme--transparent & {
    background: ${props => props.theme.color('transparent')};
  }

  .card-theme.bg-charcoal & {
    color: ${props => props.theme.color('white')};
  }
`;

export const CardPostBody = styled(Space).attrs({
  v: {
    size: 'm',
    properties: ['padding-bottom'],
    overrides: { small: 5, medium: 5, large: 5 },
  },
  h: {
    size: 'm',
    properties: ['padding-left', 'padding-right'],
    overrides: { small: 5, medium: 5, large: 5 },
  },
})`
  .card-theme.card-theme--transparent & {
    padding-left: 0;
    padding-right: 0;
  }
`;

export const CardBody = styled(Space).attrs(() => ({
  v: { size: 'm', properties: ['padding-top'] },
  h: {
    size: 'm',
    properties: ['padding-left', 'padding-right'],
    overrides: { small: 5, medium: 5, large: 5 },
  },
  className: 'flex flex--column flex-1',
}))`
  justify-content: space-between;

  ${props =>
    props.theme.makeSpacePropertyValues('l', ['padding-bottom'], false, {
      small: 8,
      medium: 8,
      large: 8,
    })}

  .card-theme.card-theme--transparent & {
    padding-left: 0;
    padding-right: 0;
    justify-content: unset;
  }
`;

const Card: FunctionComponent<Props> = ({ item }: Props) => {
  return (
    <CardOuter
      href={item.link}
      onClick={() => {
        trackEvent({
          category: 'Card',
          action: 'follow link',
          label: `${item.title || ''}`,
        });
      }}
    >
      <div className="relative">
        {item.image && item.image.crops && item.image.crops['16:9'] && (
          <UiImage
            {...item.image.crops['16:9']}
            alt=""
            sizesQueries="(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(33.24vw - 43px), calc(100vw - 36px)"
            showTasl={false}
          />
        )}
        {item.format && (
          <div style={{ position: 'absolute', bottom: 0 }}>
            <LabelsList labels={[{ text: item.format.title }]} />
          </div>
        )}
      </div>

      <CardBody>
        <div>
          {item.order && <PartNumberIndicator number={item.order} />}
          {item.title && (
            <Space
              v={{
                size: 's',
                properties: ['margin-bottom'],
              }}
              as="h2"
              className={classNames({
                'promo-link__title': true,
                [font('wb', 3)]: true,
              })}
            >
              {item.title}
            </Space>
          )}
          {item.description && (
            <p className={`${font('hnr', 5)} no-padding no-margin`}>
              {item.description}
            </p>
          )}
        </div>
      </CardBody>
    </CardOuter>
  );
};

export default Card;
