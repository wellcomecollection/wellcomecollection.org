import { classNames, font } from '../../../utils/classnames';
import LabelsList from '../LabelsList/LabelsList';
// import { formatDate } from '../../../../common/utils/format-date';
import { trackEvent } from '../../../utils/ga';
import { FunctionComponent } from 'react';
import { Season } from '../../../model/seasons';
import linkResolver from '../../../../common/services/prismic/link-resolver';
import styled from 'styled-components';
import Space from '../styled/Space';
import { UiImage } from '../Images/Images';
import ButtonOutlined from '../ButtonOutlined/ButtonOutlined';

type CardOuterProps = {
  highlightColor: 'yellow' | 'orange';
  background: 'charcoal' | 'cream';
};

const CardOuter = styled.a<CardOuterProps>`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-decoration: none;
  border-left: 4px solid ${props => props.theme.color(props.highlightColor)};
  background: ${props => props.theme.color(props.background)};
  color: ${props =>
    props.theme.color(props.background === 'charcoal' ? 'cream' : 'black')};

  ${props => props.theme.media.large`
    flex-direction: row;
  `}
`;

const TextWrapper = styled.div`
  ${props => props.theme.media.large`
    flex-grow: 2;
  `};
`;
const ImageWrapper = styled.div`
  ${props => props.theme.media.large`
    flex-grow: 1;
    flex-basis: 106%;
  `};
  ${props => props.theme.media.xlarge`
    flex-basis: 48%;
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
  const { type, title, description, image, link } = {
    type: getTypeLabel(item.type),
    title: item.title,
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
      highlightColor={highlightColor}
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
            size: 's',
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
      <Space
        as={ImageWrapper}
        // h={{ size: 'm', properties: ['padding-left'], overrides: { small: 0 } }}
      >
        <UiImage
          {...image.crops['16:9']}
          // sizesQueries="(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(33.24vw - 43px), calc(100vw - 36px)"
          showTasl={false}
        />
      </Space>
    </CardOuter>
  );
};

export default BannerCard;
