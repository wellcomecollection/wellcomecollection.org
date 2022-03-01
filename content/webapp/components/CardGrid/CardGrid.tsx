import { FunctionComponent } from 'react';
import moment from 'moment';
import { classNames, cssGrid } from '@weco/common/utils/classnames';
import { Link } from '@weco/common/model/link';
import { convertItemToCardProps } from '@weco/common/model/card';
import { ArticleScheduleItem } from '@weco/common/model/article-schedule-items';
import { Exhibition } from '../../types/exhibitions';
import { UiEvent } from '@weco/common/model/events';
import { Article } from '../../types/articles';
import { Page } from '@weco/common/model/pages';
import { ArticleSeries } from '@weco/common/model/article-series';
import BookPromo from '../BookPromo/BookPromo';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';
import Space from '@weco/common/views/components/styled/Space';
import CssGridContainer from '@weco/common/views/components/styled/CssGridContainer';
import Card from '@weco/common/views/components/Card/Card';
import EventPromo from '../EventPromo/EventPromo';
import ExhibitionPromo from '../ExhibitionPromo/ExhibitionPromo';
import StoryPromo from '../StoryPromo/StoryPromo';
import DailyTourPromo from './DailyTourPromo';
import { Book } from '../../types/books';
import { Project } from '../../types/projects';
import { Guide } from '../../types/guides';

// TODO: This should be MultiContent
export type ContentTypes =
  | UiEvent
  | Exhibition
  | Book
  | Article
  | Page
  | Project
  | ArticleSeries
  | ArticleScheduleItem
  | Guide;

type Props = {
  items: readonly ContentTypes[];
  hidePromoText?: boolean;
  itemsPerRow: number;
  itemsHaveTransparentBackground?: boolean;
  links?: Link[];
  fromDate?: moment.Moment;
};

const CardGrid: FunctionComponent<Props> = ({
  items,
  hidePromoText,
  itemsPerRow,
  itemsHaveTransparentBackground = false,
  links,
  fromDate,
}: Props) => {
  const gridColumns = itemsPerRow === 4 ? 3 : 4;
  return (
    <div>
      <CssGridContainer>
        <div className="css-grid">
          {items.map((item, i) => (
            <div
              key={item.id}
              className={classNames({
                [cssGrid({
                  s: 12,
                  m: 6,
                  l: gridColumns,
                  xl: gridColumns,
                })]: true,
                'card-theme card-theme--transparent':
                  itemsHaveTransparentBackground,
              })}
            >
              {item.id === 'tours' && <DailyTourPromo />}

              {item.type === 'exhibitions' && (
                <ExhibitionPromo exhibition={item} position={i}/>
              )}
              {item.id !== 'tours' && item.type === 'events' && (
                <EventPromo event={item} position={i} fromDate={fromDate} />
              )}
              {item.type === 'articles' && (
                <StoryPromo
                  article={item}
                  position={i}
                  hidePromoText={hidePromoText}
                />
              )}
              {item.type === 'books' && (
                <BookPromo
                  url={`/books/${item.id}`}
                  title={item.title}
                  subtitle={item.subtitle}
                  description={item.promoText}
                  image={item.cover}
                />
              )}
              {(item.type === 'pages' || item.type === 'series') && (
                <Card item={convertItemToCardProps(item)} />
              )}
            </div>
          ))}
        </div>
      </CssGridContainer>
      {links && links.length > 0 && (
        <Layout12>
          <Space v={{ size: 'l', properties: ['margin-top'] }}>
            {links.map(link => (
              <Space
                v={{ size: 'm', properties: ['margin-top'] }}
                key={link.url}
              >
                <MoreLink url={link.url} name={link.text} />
              </Space>
            ))}
          </Space>
        </Layout12>
      )}
    </div>
  );
};

export default CardGrid;
