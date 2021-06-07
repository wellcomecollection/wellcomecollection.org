// @flow
import { type Node } from 'react';
import { type UiImageProps, UiImage } from '../../components/Images/Images';
import type { UiExhibition } from '../../../../common/model/exhibitions';
import type { UiEvent } from '../../../../common/model/events';
import type { Article } from '../../../../common/model/articles';
import type { Season } from '../../../../common/model/seasons';
import type { Card } from '../../../../common/model/card';
import { type Label } from '../../../../common/model/labels';
import { type Link } from '../../../../common/model/link';
// $FlowFixMe(tsx)
import PartNumberIndicator from '../../components/PartNumberIndicator/PartNumberIndicator';
import { grid, classNames, font } from '../../../utils/classnames';
// $FlowFixMe (tsx)
import Space from '../styled/Space';
import styled from 'styled-components';
// $FlowFixMe (tsx)
import LabelsList from '../LabelsList/LabelsList';
import StatusIndicator from '../../components/StatusIndicator/StatusIndicator';
import { formatDate } from '../../../../common/utils/format-date';
import {
  getPositionInSeries,
  getArticleColor,
} from '../../../../common/model/articles';
import { trackEvent } from '../../../utils/ga';
import linkResolver from '../../../../common/services/prismic/link-resolver';

type PartialFeaturedCard = {|
  id: string,
  image: ?UiImageProps,
  labels: Label[],
  link: Link,
|};

type Props = {|
  ...PartialFeaturedCard,
  children: Node,
  background: string,
  color: string,
  isReversed?: boolean,
|};

export function convertCardToFeaturedCardProps(
  item: Card
): PartialFeaturedCard {
  return {
    id: item.title || 'card',
    image: {
      ...item.image,
      extraClasses: '',
      sizesQueries: '',
      showTasl: false,
    },
    labels: item.format ? [{ text: item.format.title }] : [],
    link: { url: item.link || '', text: item.title || '' },
  };
}

export function convertItemToFeaturedCardProps(
  item: Article | UiEvent | UiExhibition | Season
) {
  return {
    id: item.id,
    image: item.promoImage && {
      alt: '',
      contentUrl: item.promoImage.contentUrl,
      width: item.promoImage.width,
      height: item.promoImage.height || 9,
      sizesQueries:
        '(min-width: 1420px) 698px, (min-width: 960px) 50.23vw, (min-width: 600px) calc(100vw - 84px), 100vw',
      tasl: item.promoImage.tasl,
      showTasl: false,
      crops: {},
    },
    labels: item.labels,
    link: {
      url: linkResolver({ id: item.id, type: item.type }),
      text: item.title,
    },
  };
}

type FeaturedCardArticleProps = {|
  article: Article,
  background: string,
  color: string,
|};

type FeaturedCardArticleBodyProps = {|
  article: Article,
|};

export const FeaturedCardArticle = ({
  article,
  background,
  color,
}: FeaturedCardArticleProps) => {
  const props = convertItemToFeaturedCardProps(article);

  return (
    <FeaturedCard {...props} background={background} color={color}>
      <FeaturedCardArticleBody article={article} />
    </FeaturedCard>
  );
};

// TODO: make this e.g. just `CardArticleBody` and work it back into the existing promos/cards
const FeaturedCardArticleBody = ({ article }: FeaturedCardArticleBodyProps) => {
  const positionInSeries = getPositionInSeries(article);
  const seriesColor = getArticleColor(article);
  return (
    <>
      {positionInSeries && (
        <PartNumberIndicator number={positionInSeries} color={seriesColor} />
      )}
      <h2
        className={classNames({
          [font('wb', 2)]: true,
        })}
      >
        {article.title}
      </h2>
      {article.promoText && (
        <p
          className={classNames({
            [font('hnl', 5)]: true,
          })}
        >
          {article.promoText}
        </p>
      )}
      {article.series.length > 0 && (
        <Space v={{ size: 'l', properties: ['margin-top'] }}>
          {article.series.map(series => (
            <p key={series.title} className={`${font('hnm', 6)} no-margin`}>
              <span className={font('hnl', 6)}>Part of</span> {series.title}
            </p>
          ))}
        </Space>
      )}
    </>
  );
};

type FeaturedCardExhibitionProps = {|
  exhibition: UiExhibition,
  background: string,
  color: string,
|};

export const FeaturedCardExhibition = ({
  exhibition,
  background,
  color,
}: FeaturedCardExhibitionProps) => {
  const props = convertItemToFeaturedCardProps(exhibition);

  return (
    <FeaturedCard {...props} background={background} color={color}>
      <FeaturedCardExhibitionBody exhibition={exhibition} />
    </FeaturedCard>
  );
};
type FeaturedCardExhibitionBodyProps = {|
  exhibition: UiExhibition,
|};

const FeaturedCardExhibitionBody = ({
  exhibition,
}: FeaturedCardExhibitionBodyProps) => {
  return (
    <div data-test-id="featured-exhibition">
      <h2
        className={classNames({
          [font('wb', 2)]: true,
        })}
      >
        {exhibition.title}
      </h2>
      {!exhibition.statusOverride && exhibition.start && exhibition.end && (
        <Space
          as="p"
          v={{ size: 'm', properties: ['margin-bottom'] }}
          className={`${font('hnl', 4)} no-margin no-padding`}
        >
          <>
            <time dateTime={exhibition.start}>
              {formatDate(exhibition.start)}
            </time>
            —{/* $FlowFixMe */}
            <time dateTime={exhibition.end}>{formatDate(exhibition.end)}</time>
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

const FeaturedCardLink = styled.a.attrs(props => ({
  className: classNames({
    'grid flex-end promo-link plain-link': true,
  }),
}))`
  flex-direction: ${props => (props.isReversed ? 'row-reverse' : 'row')};
`;

const FeaturedCardLeft = styled.div.attrs({
  className: classNames({
    [grid({ s: 12, m: 12, l: 7, xl: 7 })]: true,
  }),
})``;

const FeaturedCardRight = styled.div.attrs({
  className: classNames({
    'flex flex--column': true,
  }),
})`
  padding-left: ${props => (props.isReversed ? 0 : props.theme.gutter.small)}px;
  padding-right: ${props =>
    props.isReversed ? props.theme.gutter.small : 0}px;
  transform: translateY(-26px);
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

const FeaturedCardCopy = styled(Space).attrs(props => ({
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'flex-1': true,
  }),
}))`
  ${props => props.theme.media.large`
    margin-right: -${props => props.theme.gutter.large}px;
  `}
`;

const FeaturedCardShim = styled.div.attrs(props => ({
  className: classNames({
    [`bg-${props.background}`]: true,
    'is-hidden-s is-hidden-m relative': true,
    [grid({ s: 12, m: 11, l: 5, xl: 5 })]: true,
  }),
}))`
  height: 21px;
  /* Prevent a white line appearing above the shim because of browser rounding errors */
  top: -1px;
  margin-left: ${props =>
    props.isReversed ? props.theme.gutter.large + 'px' : null};
`;

const FeaturedCard = ({
  id,
  image,
  labels,
  children,
  link,
  color,
  background,
  isReversed,
}: Props) => {
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
        <FeaturedCardLeft>{image && <UiImage {...image} />}</FeaturedCardLeft>
        <div
          className={classNames({
            flex: true,
            [grid({ s: 12, m: 11, l: 5, xl: 5 })]: true,
          })}
        >
          <FeaturedCardRight isReversed={isReversed}>
            {labels && labels.length > 0 ? (
              <LabelsList labels={labels} />
            ) : (
              <div style={{ marginBottom: '26px' }} />
            )}
            <FeaturedCardCopy
              className={classNames({
                [`bg-${background} font-${color}`]: true,
              })}
            >
              {children}
            </FeaturedCardCopy>
          </FeaturedCardRight>
        </div>
        <div
          className={classNames({
            [grid({ s: 12, m: 12, l: 7, xl: 7 })]: true,
          })}
        ></div>
        <FeaturedCardShim background={background} isReversed={isReversed} />
      </FeaturedCardLink>
    </FeaturedCardWrap>
  );
};

export default FeaturedCard;
