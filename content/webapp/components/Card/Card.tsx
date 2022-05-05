import { Card as CardType } from '../../types/card';
import { font, classNames } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import { FunctionComponent } from 'react';
import PartNumberIndicator from '../PartNumberIndicator/PartNumberIndicator';
import { getCrop } from '@weco/common/model/image';
import PrismicImage from '../PrismicImage/PrismicImage';

type Props = {
  item: CardType;
};

export const CardOuter = styled.a.attrs<{ className?: string }>(() => ({
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
  const image = getCrop(item.image, '16:9');

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
        {image && (
          <PrismicImage
            image={image}
            sizes={{
              xlarge: 1 / 4,
              large: 1 / 4,
              medium: 1 / 2,
              small: 1,
            }}
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
