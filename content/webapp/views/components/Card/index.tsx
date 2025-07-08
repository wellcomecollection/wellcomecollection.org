import { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';

import { getCrop } from '@weco/common/model/image';
import { Label as LabelType } from '@weco/common/model/labels';
import { font } from '@weco/common/utils/classnames';
import LabelsList from '@weco/common/views/components/LabelsList';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import PartNumberIndicator from '@weco/content/views/components/PartNumberIndicator';
import { Card as CardType } from '@weco/content/types/card';

export const CardImageWrapper = styled.div`
  position: relative;
`;

type Props = {
  item: CardType;
};

const sharedCardOuter = css`
  height: 100%;
  display: block; /* IE */

  @supports (display: flex) {
    /* IE ignores @supports */
    display: flex;
  }

  overflow: hidden;
  flex-direction: column;

  background: ${props => props.theme.color('warmNeutral.300')};
  min-height: ${props => props.theme.minCardHeight}px;
  border-radius: ${props => props.theme.borderRadiusUnit}px;

  &,
  &:link,
  &:visited {
    text-decoration: none;
    border: none;
  }

  &:hover,
  &:focus {
    h2,
    h3 {
      text-decoration: underline;
      text-decoration-color: ${props => props.theme.color('currentColor')};
    }
  }

  .card-theme.card-theme--white & {
    background: ${props => props.theme.color('white')};
  }

  .card-theme.card-theme--transparent & {
    background: transparent;
    min-height: auto;
  }

  .card-theme.bg-dark & {
    color: ${props => props.theme.color('white')};
  }

  .card-theme.bg-dark {
    &:hover,
    &:focus {
      h2,
      h3 {
        text-decoration-color: ${props => props.theme.color('white')};
      }
    }
  }
`;

export const CardOuter = styled.a.attrs<{
  'data-gtm-trigger'?: 'card_link';
}>({
  'data-gtm-trigger': 'card_link',
})`
  ${sharedCardOuter};
`;

export const CardPostBody = styled(Space).attrs({
  $v: {
    size: 'm',
    properties: ['padding-bottom'],
    overrides: { small: 5, medium: 5, large: 5 },
  },
  $h: {
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

export const CardBody = styled(Space).attrs({
  $v: { size: 'm', properties: ['padding-top'] },
  $h: {
    size: 'm',
    properties: ['padding-left', 'padding-right'],
    overrides: { small: 5, medium: 5, large: 5 },
  },
})`
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

const LabelsWrapper = styled.div`
  position: absolute;
  bottom: 0;
`;

export const CardLabels: FunctionComponent<{ labels: LabelType[] }> = ({
  labels,
}) => (
  <LabelsWrapper>
    <LabelsList labels={labels} />
  </LabelsWrapper>
);

const Description = styled.p.attrs({
  className: font('intr', 5),
})`
  padding: 0;
  margin: 0;
`;

export const CardTitle = styled(Space).attrs({
  as: 'h3',
  className: font('wb', 3),
  $v: { size: 's', properties: ['margin-bottom'] },
})`
  transition: color 400ms ease;
`;

const Card: FunctionComponent<Props> = ({ item }: Props) => {
  const image = getCrop(item.image, '16:9');

  return (
    <CardOuter href={item.link}>
      <CardImageWrapper>
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
        {item.format && <CardLabels labels={[{ text: item.format.title }]} />}
      </CardImageWrapper>

      <CardBody>
        <div>
          {item.order && <PartNumberIndicator number={item.order} />}
          {item.title && <CardTitle>{item.title}</CardTitle>}
          {item.description && <Description>{item.description}</Description>}
        </div>
      </CardBody>
    </CardOuter>
  );
};

export default Card;
