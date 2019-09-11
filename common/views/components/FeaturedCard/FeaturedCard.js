// @flow
import { type Node } from 'react';
import NextLink from 'next/link';
import { type UiImageProps, UiImage } from '../../components/Images/Images';
import type { UiExhibition } from '../../../../common/model/exhibitions';
import type { Article } from '../../../../common/model/articles';
import { type Label } from '../../../../common/model/labels';
import { type Link } from '../../../../common/model/link';
import PartNumberIndicator from '../../components/PartNumberIndicator/PartNumberIndicator';
import { grid, classNames, font } from '../../../utils/classnames';
import Space from '../styled/Space';
import styled from 'styled-components';
import LabelsList from '../LabelsList/LabelsList';
import StatusIndicator from '../../components/StatusIndicator/StatusIndicator';
import { formatDate } from '../../../../common/utils/format-date';
import {
  getPositionInSeries,
  getArticleColor,
} from '../../../../common/model/articles';
import { trackEvent } from '../../../utils/ga';

type Props = {|
  id: string,
  image: ?UiImageProps,
  labels: ?(Label[]),
  children: Node,
  link: Link,
  background: string,
  color: string,
|};

type FeaturedCardStoryBodyProps = {|
  article: Article,
|};

export const FeaturedCardStoryBody = ({
  article,
}: FeaturedCardStoryBodyProps) => {
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

type FeaturedCardExhibitionBodyProps = {|
  exhibition: UiExhibition,
|};

export const FeaturedCardExhibitionBody = ({
  exhibition,
}: FeaturedCardExhibitionBodyProps) => {
  return (
    <>
      <h2
        className={classNames({
          [font('wb', 2)]: true,
        })}
      >
        {exhibition.title}
      </h2>
      {!exhibition.statusOverride && exhibition.start && exhibition.end && (
        <p className={`${font('hnl', 5)} no-margin no-padding`}>
          <>
            <time dateTime={exhibition.start}>
              {formatDate(exhibition.start)}
            </time>
            —{/* $FlowFixMe */}
            <time dateTime={exhibition.end}>{formatDate(exhibition.end)}</time>
          </>
        </p>
      )}
      <StatusIndicator
        start={exhibition.start}
        end={exhibition.end || new Date()}
        statusOverride={exhibition.statusOverride}
      />
    </>
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
  padding-left: ${props => props.theme.gutter.small}px;
  margin-top: -60px;
  width: 100%;
  height: 100%;
  min-height: 200px;

  ${props => props.theme.media.medium`
    padding-left: 0;
  `}

  ${props => props.theme.media.large`
    margin-left: -${props => props.theme.gutter.large}px;
    margin-top: 0;
  `}
`;

const FeaturedCardCopy = styled(Space).attrs(props => ({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'flex-1': true,
  }),
}))`
  ${props => props.theme.media.large`
    margin-right: -${props => props.theme.gutter.large}px;
  `}
`;

const FeaturedCard = ({
  id,
  image,
  labels,
  children,
  link,
  color,
  background,
}: Props) => {
  return (
    <div className="container">
      <FeaturedCardWrap>
        <NextLink href={link.url}>
          <a
            onClick={() => {
              trackEvent({
                category: 'FeaturedCard',
                action: 'follow link',
                label: `${id}`,
              });
            }}
            className="grid flex-end promo-link plain-link"
          >
            <FeaturedCardLeft>
              {image && <UiImage {...image} />}
            </FeaturedCardLeft>
            <div
              className={classNames({
                flex: true,
                [grid({ s: 12, m: 11, l: 5, xl: 5 })]: true,
              })}
            >
              <FeaturedCardRight>
                {labels && labels.length > 0 && <LabelsList labels={labels} />}
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
            <div
              style={{ height: '20px' }}
              className={classNames({
                [`bg-${background}`]: true,
                'is-hidden-s is-hidden-m': true,
                [grid({ s: 12, m: 11, l: 5, xl: 5 })]: true,
              })}
            ></div>
          </a>
        </NextLink>
      </FeaturedCardWrap>
    </div>
  );
};

export default FeaturedCard;
