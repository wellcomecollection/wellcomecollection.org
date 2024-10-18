import { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';

import { ImageType } from '@weco/common/model/image';
import { Label } from '@weco/common/model/labels';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font, grid } from '@weco/common/utils/classnames';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';
import DateRange from '@weco/content/components/DateRange/DateRange';
import PartNumberIndicator from '@weco/content/components/PartNumberIndicator/PartNumberIndicator';
import StatusIndicator from '@weco/content/components/StatusIndicator/StatusIndicator';
import {
  ArticleBasic,
  getArticleColor,
  getPartNumberInSeries,
} from '@weco/content/types/articles';
import { BookBasic } from '@weco/content/types/books';
import { Card } from '@weco/content/types/card';
import { EventSeries } from '@weco/content/types/event-series';
import { EventBasic } from '@weco/content/types/events';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { Guide } from '@weco/content/types/guides';
import { Link } from '@weco/content/types/link';
import { Page } from '@weco/content/types/pages';
import { Season } from '@weco/content/types/seasons';
import { SeriesBasic } from '@weco/content/types/series';

type PartialFeaturedCard = {
  image?: ImageType;
  labels: Label[];
  link: Link;
};

type Props = PartialFeaturedCard & {
  background: PaletteColor;
  textColor: PaletteColor;
  isReversed?: boolean;
};

export function convertCardToFeaturedCardProps(
  item: Card
): PartialFeaturedCard {
  return {
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
    | BookBasic
    | SeriesBasic
    | EventBasic
    | Guide
): PartialFeaturedCard {
  return {
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
      url: linkResolver(item),
      text: item.title,
    },
  };
}

type FeaturedCardArticleProps = {
  article: ArticleBasic;
  background: PaletteColor;
  textColor: PaletteColor;
};

type FeaturedCardArticleBodyProps = {
  article: ArticleBasic;
};

// TODO: make this e.g. just `CardArticleBody` and work it back into the existing promos/cards
const FeaturedCardArticleBody: FunctionComponent<
  FeaturedCardArticleBodyProps
> = ({ article }) => {
  const partNumber = getPartNumberInSeries(article);
  const seriesColor = getArticleColor(article);
  return (
    <>
      {partNumber && (
        <PartNumberIndicator
          number={partNumber}
          backgroundColor={seriesColor}
        />
      )}
      <h2 className={font('wb', 2)}>{article.title}</h2>
      {article.promo?.caption && (
        <p className={font('intr', 5)}>{article.promo?.caption}</p>
      )}
      {article.series.length > 0 && (
        <Space $v={{ size: 'l', properties: ['margin-top'] }}>
          {article.series.map(series => (
            <p
              key={series.title}
              className={font('intb', 6)}
              style={{ marginBottom: 0 }}
            >
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
  background: PaletteColor;
  textColor: PaletteColor;
};

const DateWrapper = styled(Space).attrs({
  className: font('intr', 4),
  $v: { size: 'm', properties: ['margin-bottom'] },
})`
  margin: 0;
  padding: 0;
`;

type FeaturedCardExhibitionBodyProps = {
  exhibition: ExhibitionBasic;
};

const FeaturedCardExhibitionBody = ({
  exhibition,
}: FeaturedCardExhibitionBodyProps) => {
  return (
    <div>
      <h3 className={font('wb', 2)}>{exhibition.title}</h3>
      {!exhibition.statusOverride && exhibition.start && exhibition.end && (
        <DateWrapper as="p">
          <DateRange start={exhibition.start} end={exhibition.end} />
        </DateWrapper>
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

  ${props => props.theme.media('medium')`
    margin-left: 0;
    margin-right: 0;
  `}
`;

type HasIsReversed = { $isReversed: boolean };
const FeaturedCardLink = styled.a.attrs({
  className: 'grid',
  'data-gtm-trigger': 'featured_card_link',
})<HasIsReversed>`
  justify-content: flex-end;
  flex-direction: ${props => (props.$isReversed ? 'row-reverse' : 'row')};

  &,
  &:link,
  &:visited {
    text-decoration: none;
    border: none;
  }
`;

const FeaturedCardLeft = styled.div.attrs({
  className: grid({ s: 12, m: 12, l: 7, xl: 7 }),
})``;

const FeaturedCardRight = styled.div<HasIsReversed>`
  display: flex;
  flex-direction: column;
  padding-left: ${props =>
    props.$isReversed ? 0 : props.theme.gutter.small}px;
  padding-right: ${props =>
    props.$isReversed ? props.theme.gutter.small : 0}px;
  transform: translateY(-28px); /* Height of a label (font size + padding) */
  width: 100%;
  height: 100%;
  min-height: 200px;

  ${props => props.theme.media('medium')`
    padding-left: 0;
    padding-right: 0;
  `}

  ${props =>
    props.theme.media('large')(`
      margin-left: ${props.$isReversed ? 0 : -props.theme.gutter.large + 'px'};
      transform: translateY(0);
    `)}
`;

const FeaturedCardCopy = styled(Space).attrs({
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})<{ $textColor: PaletteColor; $background: PaletteColor }>`
  flex: 1;
  color: ${props => props.theme.color(props.$textColor)};
  background-color: ${props => props.theme.color(props.$background)};

  ${props =>
    props.theme.media('large')(`
      margin-right: -${props.theme.gutter.large}px;
    `)}
`;

const FeaturedCardShim = styled.div.attrs<{ $background: PaletteColor }>({
  className: `is-hidden-s is-hidden-m ${grid({ s: 12, m: 11, l: 5, xl: 5 })}`,
})<HasIsReversed & { $background: PaletteColor }>`
  position: relative;
  background-color: ${props => props.theme.color(props.$background)};
  height: 21px;

  /* Prevent a white line appearing above the shim because of browser rounding errors */
  top: -1px;
  margin-left: ${props =>
    props.$isReversed ? props.theme.gutter.large + 'px' : null};
`;

const FeaturedCard: FunctionComponent<PropsWithChildren<Props>> = ({
  image,
  labels,
  children,
  link,
  textColor,
  background,
  isReversed = false,
}) => {
  return (
    <FeaturedCardWrap>
      <FeaturedCardLink href={link.url} $isReversed={isReversed}>
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
        <div
          className={grid({ s: 12, m: 11, l: 5, xl: 5 })}
          style={{ display: 'flex' }}
        >
          <FeaturedCardRight $isReversed={isReversed}>
            {labels && labels.length > 0 ? (
              <LabelsList labels={labels} />
            ) : (
              <div style={{ marginBottom: '26px' }} />
            )}
            <FeaturedCardCopy $background={background} $textColor={textColor}>
              {children}
            </FeaturedCardCopy>
          </FeaturedCardRight>
        </div>
        <div className={grid({ s: 12, m: 12, l: 7, xl: 7 })}></div>
        <FeaturedCardShim $background={background} $isReversed={isReversed} />
      </FeaturedCardLink>
    </FeaturedCardWrap>
  );
};

export const FeaturedCardArticle: FunctionComponent<
  FeaturedCardArticleProps
> = ({ article, background, textColor }) => {
  const props = convertItemToFeaturedCardProps(article);

  return (
    <FeaturedCard {...props} background={background} textColor={textColor}>
      <FeaturedCardArticleBody article={article} />
    </FeaturedCard>
  );
};

export const FeaturedCardExhibition: FunctionComponent<
  FeaturedCardExhibitionProps
> = ({ exhibition, background, textColor }) => {
  const props = convertItemToFeaturedCardProps(exhibition);

  return (
    <FeaturedCard {...props} background={background} textColor={textColor}>
      <FeaturedCardExhibitionBody exhibition={exhibition} />
    </FeaturedCard>
  );
};

export default FeaturedCard;
