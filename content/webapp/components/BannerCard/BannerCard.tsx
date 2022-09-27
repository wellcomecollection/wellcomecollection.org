import { font } from '@weco/common/utils/classnames';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import { trackEvent } from '@weco/common/utils/ga';
import { FunctionComponent } from 'react';
import { Season } from '../../types/seasons';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import DateRange from '@weco/common/views/components/DateRange/DateRange';
import { arrowSmall } from '@weco/common/icons';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { getCrop } from '@weco/common/model/image';
import { themeValues } from '@weco/common/views/themes/config';

type CardOuterProps = {
  background: 'neutral.700' | 'warmNeutral.300';
};

const CardOuter = styled.a<CardOuterProps>`
  display: flex;
  flex-direction: column-reverse;
  overflow: hidden;
  text-decoration: none;
  background: ${props => props.theme.newColor(props.background)};
  color: ${props =>
    props.theme.newColor(
      props.background === 'neutral.700' ? 'warmNeutral.300' : 'black'
    )};

  ${props => props.theme.media.large`
    flex-direction: row;
    `}
`;

type TextWrapperProps = {
  highlightColor: 'yellow' | 'accent.salmon';
};

const TextWrapper = styled.div<TextWrapperProps>`
  ${props => props.theme.media.large`
    flex-grow: 2;
    `};
  border-left: 4px solid ${props => props.theme.newColor(props.highlightColor)};
`;

type ImageWrapperProps = {
  imageUrl: string;
};

const ImageWrapper = styled.div<ImageWrapperProps>`
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center top;
  height: 300px;
  ${props => props.theme.media.large`
    background-position: center center;
    height: auto;
    min-width: 38%;
  `};
`;

function getTypeLabel(type: 'seasons') {
  switch (type) {
    case 'seasons':
      return 'Season';
    default:
      return null;
  }
}

type Props = {
  item: Season;
  background?: 'neutral.700' | 'warmNeutral.300';
  highlightColor?: 'yellow' | 'accent.salmon';
};

const BannerCard: FunctionComponent<Props> = ({
  item,
  background = 'neutral.700',
  highlightColor = 'accent.salmon',
}: Props) => {
  const { type, title, start, end, description, image, link } = {
    type: getTypeLabel(item.type),
    title: item.title,
    start: item.start,
    end: item.end,
    description: item.promo && item.promo.caption,
    image: item.promo &&
      item.promo.image && {
        contentUrl: item.promo.image.contentUrl,
        // We intentionally omit the alt text on promos, so screen reader
        // users don't have to listen to the alt text before hearing the
        // title of the item in the list.
        //
        // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
        alt: '',
        width: 1600,
        height: 900,
        tasl: item.promo.image.tasl,
        crops: {
          '16:9': {
            contentUrl: getCrop(item.image, '16:9')?.contentUrl || '',
            alt: '',
            width: 1600,
            height: 900,
            crops: {},
            tasl: item.promo.image.tasl,
          },
        },
      },
    link:
      (item.promo && item.promo.link) ||
      linkResolver({ id: item.id, type: item.type }),
  };
  return (
    <CardOuter
      href={link}
      background={background}
      onClick={() => {
        trackEvent({
          category: 'BannerCard',
          action: 'follow link',
          label: `${title || ''}`,
        });
      }}
    >
      <Space
        as={TextWrapper}
        highlightColor={highlightColor}
        v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}
        h={{ size: 'l', properties: ['padding-left', 'padding-right'] }}
      >
        {type && (
          <LabelsList
            labels={[{ text: type }]}
            defaultLabelColor="accent.salmon"
          />
        )}
        <Space
          v={{
            size: 'm',
            properties: ['margin-top', 'margin-bottom'],
          }}
          as="h2"
          className={`promo-link__title ${font('wb', 2)}`}
        >
          {title}
        </Space>
        {start && end && (
          <Space
            v={{
              size: 's',
              properties: ['margin-top', 'margin-bottom'],
            }}
            className={`${font('intr', 5)} font-neutral-400`}
          >
            <DateRange start={start} end={end} />
          </Space>
        )}
        <p className={font('intr', 5)}>{description}</p>
        <ButtonSolid
          colors={themeValues.buttonColors.whiteTransparentWhite}
          isIconAfter={true}
          icon={arrowSmall}
          text={`Explore ${type}`}
        />
      </Space>
      {image && (
        <ImageWrapper imageUrl={convertImageUri(image.contentUrl, 640)} />
      )}
    </CardOuter>
  );
};

export default BannerCard;
