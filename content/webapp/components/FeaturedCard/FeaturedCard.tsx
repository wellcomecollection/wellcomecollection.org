import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { ImageType } from '@weco/common/model/image';
import { ExhibitionBasic } from '../../types/exhibitions';
import {
  ArticleBasic,
  getPositionInSeries,
  getArticleColor,
} from '../../types/articles';
import { Season } from '../../types/seasons';
import { Card } from '../../types/card';
import { Label } from '@weco/common/model/labels';
import { Link } from '../../types/link';
import PartNumberIndicator from '../PartNumberIndicator/PartNumberIndicator';
import { grid, font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import StatusIndicator from '@weco/common/views/components/StatusIndicator/StatusIndicator';
import { formatDate } from '@weco/common/utils/format-date';
import { trackEvent } from '@weco/common/utils/ga';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { Page } from '../../types/pages';
import { EventSeries } from '../../types/event-series';
import { Book } from '../../types/books';
import { Event } from '../../types/events';
import { Guide } from '../../types/guides';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';

type PartialFeaturedCard = {
  id: string;
  image?: ImageType;
  labels: Label[];
  link: Link;
};

type Props = PartialFeaturedCard & {
  background: string;
  color: string;
  isReversed?: boolean;
};

export function convertCardToFeaturedCardProps(
  item: Card
): PartialFeaturedCard {
  return {
    id: item.title || 'card',
    // We intentionally omit the alt text on promos, so screen reader
    // users don't have to listen to the alt text before hearing the
    // title of the item in the list.
    //
    // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
    image: item.image && {
      ...item.image,
      alt: '',
    },
    labels: item.format ? [{ text: item.format.title }] : [],
    link: { url: item.link || '', text: item.title || '' },
  };
}

export function convertItemToFeaturedCardProps(
  item:
    | ArticleBasic
    | ExhibitionBasic
    | Season
    | Page
    | EventSeries
    | Book
    | Event
    | Guide
): PartialFeaturedCard {
  return {
    id: item.id,
    image: item.promo?.image && {
      ...item.promo.image,
      // We intentionally omit the alt text on promos, so screen reader
      // users don't have to listen to the alt text before hearing the
      // title of the item in the list.
      //
      // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
      alt: '',
    },
    labels: item.labels,
    link: {
      url: linkResolver({ id: item.id, type: item.type }),
      text: item.title,
    },
  };
}

type FeaturedCardArticleProps = {
  article: ArticleBasic;
  background: string;
  color: string;
};

type FeaturedCardArticleBodyProps = {
  article: ArticleBasic;
};

// TODO: make this e.g. just `CardArticleBody` and work it back into the existing promos/cards
const FeaturedCardArticleBody: FunctionComponent<FeaturedCardArticleBodyProps> =
  ({ article }) => {
    const positionInSeries = getPositionInSeries(article);
    const seriesColor = getArticleColor(article);
    return (
      <>
        {positionInSeries && (
          <PartNumberIndicator number={positionInSeries} color={seriesColor} />
        )}
        <h2 className={font('wb', 2)}>{article.title}</h2>
        {article.promo?.caption && (
          <p className={font('intr', 5)}>{article.promo?.caption}</p>
        )}
        {article.series.length > 0 && (
          <Space v={{ size: 'l', properties: ['margin-top'] }}>
            {article.series.map(series => (
              <p key={series.title} className={`${font('intb', 6)} no-margin`}>
                <span className={font('intr', 6)}>Part of</span> {series.title}
              </p>
            ))}
          </Space>
        )}
      </>
    );
  };

type FeaturedCardExhibitionProps = {
  exhibition: ExhibitionBasic;
  background: string;
  color: string;
};

type FeaturedCardExhibitionBodyProps = {
  exhibition: ExhibitionBasic;
};

const FeaturedCardExhibitionBody = ({
  exhibition,
}: FeaturedCardExhibitionBodyProps) => {
  return (
    <div data-test-id="featured-exhibition">
      <h2 className={font('wb', 2)}>{exhibition.title}</h2>
      {!exhibition.statusOverride && exhibition.start && exhibition.end && (
        <Space
          as="p"
          v={{ size: 'm', properties: ['margin-bottom'] }}
          className={`${font('intr', 4)} no-margin no-padding`}
        >
          <>
            <time dateTime={exhibition.start.toUTCString()}>
              {formatDate(exhibition.start)}
            </time>
            {' – '}
            <time dateTime={exhibition.end.toISOString()}>
              {formatDate(exhibition.end)}
            </time>
          </>
        </Space>
      )}
      <StatusIndicator
        start={exhibition.start}
        end={exhibition.end || new Date()}
        statusOverride={exhibition.statusOverride}
      />
    </div>
  );
};

const FeaturedCardWrap = styled.div`
  margin-left: -${props => props.theme.gutter.small}px;
  margin-right: -${props => props.theme.gutter.small}px;

  ${props => props.theme.media.medium`
    margin-left: 0;
    margin-right: 0;
  `}
`;

type HasIsReversed = { isReversed: boolean };
const FeaturedCardLink = styled.a.attrs(() => ({
  className: 'grid flex-end promo-link plain-link',
}))<HasIsReversed>`
  flex-direction: ${props => (props.isReversed ? 'row-reverse' : 'row')};
`;

const FeaturedCardLeft = styled.div.attrs({
  className: grid({ s: 12, m: 12, l: 7, xl: 7 }),
})``;

const FeaturedCardRight = styled.div.attrs({
  className: 'flex flex--column',
})<HasIsReversed>`
  padding-left: ${props => (props.isReversed ? 0 : props.theme.gutter.small)}px;
  padding-right: ${props =>
    props.isReversed ? props.theme.gutter.small : 0}px;
  transform: translateY(-28px); // Height of a label (font size + padding)
  width: 100%;
  height: 100%;
  min-height: 200px;

  ${props => props.theme.media.medium`
    padding-left: 0;
    padding-right: 0;
  `}

  ${props => props.theme.media.large`
    margin-left: ${props =>
      props.isReversed ? 0 : -props.theme.gutter.large + 'px'};
    transform: translateY(0);
  `}
`;

const FeaturedCardCopy = styled(Space).attrs<{ color: string }>(props => ({
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  className: `flex-1 font-${props.color}`,
}))<{ background: string }>`
  background-color: ${props => props.theme.color(props.background)};

  ${props => props.theme.media.large`
    margin-right: -${props => props.theme.gutter.large}px;
  `}
`;

const FeaturedCardShim = styled.div.attrs<{ background: string }>({
  className: `is-hidden-s is-hidden-m ${grid({ s: 12, m: 11, l: 5, xl: 5 })}`,
})<HasIsReversed & { background: string }>`
  position: relative;
  background-color: ${props => props.theme.color(props.background)};
  height: 21px;
  /* Prevent a white line appearing above the shim because of browser rounding errors */
  top: -1px;
  margin-left: ${props =>
    props.isReversed ? props.theme.gutter.large + 'px' : null};
`;

const FeaturedCard: FunctionComponent<Props> = ({
  id,
  image,
  labels,
  children,
  link,
  color,
  background,
  isReversed = false,
}) => {
  return (
    <FeaturedCardWrap>
      <FeaturedCardLink
        href={link.url}
        isReversed={isReversed}
        onClick={() => {
          trackEvent({
            category: 'FeaturedCard',
            action: 'follow link',
            label: `${id}`,
          });
        }}
      >
        <FeaturedCardLeft>
          {image && (
            <PrismicImage
              image={image}
              sizes={{
                xlarge: 1 / 2,
                large: 1 / 2,
                medium: 1 / 2,
                small: 1,
              }}
              quality="low"
            />
          )}
        </FeaturedCardLeft>
        <div className={`flex ${grid({ s: 12, m: 11, l: 5, xl: 5 })}`}>
          <FeaturedCardRight isReversed={isReversed}>
            {labels && labels.length > 0 ? (
              <LabelsList labels={labels} />
            ) : (
              <div style={{ marginBottom: '26px' }} />
            )}
            <FeaturedCardCopy background={background} color={color}>
              {children}
            </FeaturedCardCopy>
          </FeaturedCardRight>
        </div>
        <div className={grid({ s: 12, m: 12, l: 7, xl: 7 })}></div>
        <FeaturedCardShim background={background} isReversed={isReversed} />
      </FeaturedCardLink>
    </FeaturedCardWrap>
  );
};

export const FeaturedCardArticle: FunctionComponent<FeaturedCardArticleProps> =
  ({ article, background, color }) => {
    const props = convertItemToFeaturedCardProps(article);

    return (
      <FeaturedCard {...props} background={background} color={color}>
        <FeaturedCardArticleBody article={article} />
      </FeaturedCard>
    );
  };

export const FeaturedCardExhibition: FunctionComponent<FeaturedCardExhibitionProps> =
  ({ exhibition, background, color }) => {
    const props = convertItemToFeaturedCardProps(exhibition);

    return (
      <FeaturedCard {...props} background={background} color={color}>
        <FeaturedCardExhibitionBody exhibition={exhibition} />
      </FeaturedCard>
    );
  };

export default FeaturedCard;
