import { FunctionComponent, ReactElement } from 'react';

import { classNames, grid } from '@weco/common/utils/classnames';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import CssGridContainer from '@weco/common/views/components/styled/CssGridContainer';
import Space from '@weco/common/views/components/styled/Space';
import BookPromo from '@weco/content/components/BookPromo/BookPromo';
import Card from '@weco/content/components/Card/Card';
import EventPromo from '@weco/content/components/EventPromo/EventPromo';
import ExhibitionGuideLinksPromo from '@weco/content/components/ExhibitionGuideLinksPromo/ExhibitionGuideLinksPromo';
import ExhibitionGuidePromo from '@weco/content/components/ExhibitionGuidePromo/ExhibitionGuidePromo';
import ExhibitionPromo from '@weco/content/components/ExhibitionPromo/ExhibitionPromo';
import MoreLink from '@weco/content/components/MoreLink/MoreLink';
import StoryPromo from '@weco/content/components/StoryPromo/StoryPromo';
import StoryPromoContentApi from '@weco/content/components/StoryPromo/StoryPromoContentApi';
import { Article } from '@weco/content/services/wellcome/content/types/api';
import { convertItemToCardProps } from '@weco/content/types/card';
import { Link } from '@weco/content/types/link';
import { MultiContent } from '@weco/content/types/multi-content';

import DailyTourPromo from './DailyTourPromo';

type Props = {
  items: readonly MultiContent[] | Article[];
  hidePromoText?: boolean;
  itemsPerRow: number;
  itemsHaveTransparentBackground?: boolean;
  links?: Link[];
  fromDate?: Date;
  optionalComponent?: ReactElement;
};

const CardGrid: FunctionComponent<Props> = ({
  items,
  hidePromoText,
  itemsPerRow,
  itemsHaveTransparentBackground = false,
  links,
  fromDate,
  optionalComponent,
}: Props) => {
  const gridColumns = itemsPerRow === 4 ? 3 : 4;
  return (
    <div>
      <CssGridContainer>
        <div className="grid">
          {items.map((item, i) => (
            <div
              key={item.id}
              className={classNames({
                [grid({
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
                <ExhibitionPromo exhibition={item} position={i} />
              )}
              {item.id !== 'tours' && item.type === 'events' && (
                <EventPromo event={item} position={i} fromDate={fromDate} />
              )}
              {item.type === 'Article' && (
                <StoryPromoContentApi
                  article={item}
                  hidePromoText={hidePromoText}
                />
              )}
              {item.type === 'articles' && (
                <StoryPromo article={item} hidePromoText={hidePromoText} />
              )}
              {(item.type === 'exhibition-guides' ||
                item.type === 'exhibition-highlight-tours' ||
                item.type === 'exhibition-texts') && (
                <ExhibitionGuidePromo exhibitionGuide={item} />
              )}
              {item.type === 'exhibition-guides-links' && (
                <ExhibitionGuideLinksPromo exhibitionGuide={item} />
              )}
              {item.type === 'books' && <BookPromo book={item} />}
              {(item.type === 'pages' ||
                item.type === 'series' ||
                item.type === 'projects' ||
                item.type === 'guides') && (
                <Card item={convertItemToCardProps(item)} />
              )}
              {item.type === 'visual-stories' && (
                <Card item={convertItemToCardProps(item)} />
              )}
            </div>
          ))}
        </div>
      </CssGridContainer>
      {links && links.length > 0 && (
        <ContaineredLayout gridSizes={gridSize12()}>
          <Space $v={{ size: 'l', properties: ['margin-top'] }}>
            {optionalComponent}
            {links.map(link => (
              <Space
                key={link.url}
                $v={{
                  size: `${optionalComponent ? 'l' : 'm'}`,
                  properties: ['margin-top'],
                }}
              >
                <MoreLink url={link.url} name={link.text} />
              </Space>
            ))}
          </Space>
        </ContaineredLayout>
      )}
    </div>
  );
};

export default CardGrid;
