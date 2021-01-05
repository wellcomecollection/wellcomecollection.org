import { classNames, font } from '../../../utils/classnames';
import LabelsList from '../LabelsList/LabelsList';
import { trackEvent } from '../../../utils/ga';
import { FunctionComponent } from 'react';
import { Season } from '../../../model/seasons';
import linkResolver from '../../../../common/services/prismic/link-resolver';
import styled from 'styled-components';
import Space from '../styled/Space';
import { convertImageUri } from '../../../utils/convert-image-uri';
import ButtonOutlined from '../ButtonOutlined/ButtonOutlined';
import DateRange from '../DateRange/DateRange';

type CardOuterProps = {
  background: 'charcoal' | 'cream';
};

const CardOuter = styled.a<CardOuterProps>`
  display: flex;
  flex-direction: column-reverse;
  overflow: hidden;
  text-decoration: none;
  background: ${props => props.theme.color(props.background)};
  color: ${props =>
    props.theme.color(props.background === 'charcoal' ? 'cream' : 'black')};

  ${props => props.theme.media.large`
    flex-direction: row;
    `}
`;

type TextWrapperProps = {
  highlightColor: 'yellow' | 'orange';
};

const TextWrapper = styled.div<TextWrapperProps>`
  ${props => props.theme.media.large`
    flex-grow: 2;
    `};
  border-left: 4px solid ${props => props.theme.color(props.highlightColor)};
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
  background?: 'charcoal' | 'cream';
  highlightColor?: 'yellow' | 'orange';
};

const BannerCard: FunctionComponent<Props> = ({
  item,
  background = 'charcoal',
  highlightColor = 'orange',
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
        alt: '',
        width: 1600,
        height: 900,
        tasl: item.promo.image.tasl,
        crops: {
          '16:9': {
            contentUrl:
              item.image && item.image.crops && item.image.crops['16:9']
                ? item.image.crops['16:9'].contentUrl
                : '',
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
            labels={[{ url: null, text: type }]}
            labelColor={'orange'}
          />
        )}
        <Space
          v={{
            size: 'm',
            properties: ['margin-top', 'margin-bottom'],
          }}
          as="h2"
          className={classNames({
            'promo-link__title': true,
            [font('wb', 2)]: true,
          })}
        >
          {title}
        </Space>
        {start && end && (
          <Space
            v={{
              size: 's',
              properties: ['margin-top', 'margin-bottom'],
            }}
            className={`${font('hnl', 5)} font-marble`}
          >
            <DateRange start={new Date(start)} end={new Date(end)} />
          </Space>
        )}
        <p
          className={classNames({
            [font('hnl', 5)]: true,
          })}
        >
          {description}
        </p>
        <ButtonOutlined
          icon={'arrowSmall'}
          text={`Explore ${type}`}
          isOnDark={true}
        />
      </Space>
      {image && (
        <ImageWrapper imageUrl={convertImageUri(image.contentUrl, 640)} />
      )}
    </CardOuter>
  );
};

export default BannerCard;
