import { Card as CardType } from '../../types/card';
import { font } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import { FunctionComponent } from 'react';
import PartNumberIndicator from '../PartNumberIndicator/PartNumberIndicator';
import { getCrop } from '@weco/common/model/image';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';

type Props = {
  item: CardType;
};

export const CardOuter = styled.a.attrs<{ className?: string }>(() => ({
  className: 'plain-link promo-link rounded-corners flex-ie-block',
}))`
  overflow: hidden;
  flex-direction: column;

  background: ${props => props.theme.color('warmNeutral.300')};
  min-height: ${props => props.theme.minCardHeight}px;

  .card-theme.card-theme--white & {
    background: ${props => props.theme.color('white')};
  }

  .card-theme.card-theme--transparent & {
    background: transparent;
    min-height: auto;
  }

  .card-theme.bg-neutral-700 & {
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
    padding-bottom: 0;

    ${props =>
      props.theme.makeSpacePropertyValues('l', ['padding-top'], false, {
        small: 5,
        medium: 5,
        large: 5,
      })}
  }
`;

export const CardBody = styled(Space).attrs(() => ({
  v: { size: 'm', properties: ['padding-top'] },
  h: {
    size: 'm',
    properties: ['padding-left', 'padding-right'],
    overrides: { small: 5, medium: 5, large: 5 },
  },
}))`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;

  ${props =>
    props.theme.makeSpacePropertyValues('l', ['padding-bottom'], false, {
      small: 5,
      medium: 5,
      large: 5,
    })}

  .card-theme.card-theme--transparent & {
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 0;
    /* CardBodys flex in the column axis by default, which makese them
    stretch to the height of any others on the same row. We don't want
    this behaviour when the cards don't have backgrounds because it can
    make the 'Part of' indicator feel disjointed from the rest of the
    content. Disabling flex altogether at this level is the most
    straightforward way to get what we want. */
    flex: none;
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
            // We intentionally omit the alt text on promos, so screen reader
            // users don't have to listen to the alt text before hearing the
            // title of the item in the list.
            image={{ ...image, alt: '' }}
            sizes={{
              xlarge: 1 / 4,
              large: 1 / 4,
              medium: 1 / 2,
              small: 1,
            }}
            quality="low"
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
              className={`promo-link__title ${font('wb', 3)}`}
            >
              {item.title}
            </Space>
          )}
          {item.description && (
            <p className={`${font('intr', 5)} no-padding no-margin`}>
              {item.description}
            </p>
          )}
        </div>
      </CardBody>
    </CardOuter>
  );
};

export default Card;
