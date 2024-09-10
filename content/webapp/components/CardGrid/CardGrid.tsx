import { FunctionComponent } from 'react';
import { classNames, cssGrid } from '@weco/common/utils/classnames';
import { Link } from '@weco/content/types/link';
import { convertItemToCardProps } from '@weco/content/types/card';
import BookPromo from '../BookPromo/BookPromo';
import Layout, { gridSize12 } from '@weco/common/views/components/Layout';
import MoreLink from '@weco/content/components/MoreLink/MoreLink';
import Space from '@weco/common/views/components/styled/Space';
import CssGridContainer from '@weco/common/views/components/styled/CssGridContainer';
import Card from '../Card/Card';
import EventPromo from '../EventPromo/EventPromo';
import ExhibitionPromo from '../ExhibitionPromo/ExhibitionPromo';
import StoryPromo from '../StoryPromo/StoryPromo';
import DailyTourPromo from './DailyTourPromo';
import { MultiContent } from '@weco/content/types/multi-content';
import ExhibitionGuidePromo from '../ExhibitionGuidePromo/ExhibitionGuidePromo';
import ExhibitionGuideLinksPromo from '../ExhibitionGuideLinksPromo/ExhibitionGuideLinksPromo';

type Props = {
  items: readonly MultiContent[];
  hidePromoText?: boolean;
  itemsPerRow: number;
  itemsHaveTransparentBackground?: boolean;
  links?: Link[];
  fromDate?: Date;
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
                <ExhibitionPromo exhibition={item} position={i} />
              )}
              {item.id !== 'tours' && item.type === 'events' && (
                <EventPromo event={item} position={i} fromDate={fromDate} />
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
        <Layout gridSizes={gridSize12()}>
          <Space $v={{ size: 'l', properties: ['margin-top'] }}>
            {links.map(link => (
              <Space
                key={link.url}
                $v={{ size: 'm', properties: ['margin-top'] }}
              >
                <MoreLink url={link.url} name={link.text} />
              </Space>
            ))}
          </Space>
        </Layout>
      )}
    </div>
  );
};

export default CardGrid;
