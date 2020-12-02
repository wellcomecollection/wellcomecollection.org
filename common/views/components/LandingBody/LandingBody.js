// @flow
import { defaultSerializer } from '../../../services/prismic/html-serializers';
import { classNames } from '@weco/common/utils/classnames';
import FeaturedText from '../FeaturedText/FeaturedText';
import Layout12 from '../Layout12/Layout12';
import Layout8 from '../Layout8/Layout8';
import Space from '@weco/common/views/components/styled/Space';
import SpacingSection from '../SpacingSection/SpacingSection';
import GridFactory from '../GridFactory/GridFactory';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import SectionHeader from '../SectionHeader/SectionHeader';
import Card from '../Card/Card';
import FeaturedCard, {
  convertItemToFeaturedCardProps,
  convertCardToFeaturedCardProps,
} from '../FeaturedCard/FeaturedCard';
import { convertItemToCardProps } from '@weco/common/model/card';
// $FlowFixMe (tsx)
import VisitUsStaticContent from './VisitUsStaticContent';
// $FlowFixMe (tsx)
import CollectionsStaticContent from './CollectionsStaticContent';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';
import { type Link } from '@weco/common/model/link';
// $FlowFixMe (tsx)
import { type BodyType } from '../Body/Body';

type Props = {|
  body: BodyType,
  isDropCapped?: boolean,
  pageId: string,
  onThisPage?: Link[],
  showOnThisPage?: boolean,
|};

const Body = ({
  body,
  isDropCapped,
  pageId,
  onThisPage,
  showOnThisPage,
}: Props) => {
  const featuredText = body.find(slice => slice.type === 'standfirst');
  const sections = body.filter(slice => slice.type === 'contentList');
  const sectionThemes = [
    {
      rowBackground: 'white',
      cardBackground: 'cream',
      featuredCardBackground: 'charcoal',
      featuredCardText: 'white',
    },
    {
      rowBackground: 'cream',
      cardBackground: 'white',
      featuredCardBackground: 'white',
      featuredCardText: 'black',
    },
    {
      rowBackground: 'white',
      cardBackground: 'cream',
      featuredCardBackground: 'cream',
      featuredCardText: 'black',
    },
    {
      rowBackground: 'charcoal',
      cardBackground: 'transparent',
      featuredCardBackground: 'white',
      featuredCardText: 'black',
    },
  ];

  return (
    <div
      className={classNames({
        'basic-body': true,
      })}
    >
      {featuredText && (
        <Layout8>
          <SpacingSection>
            <div className="body-text spaced-text">
              <FeaturedText
                html={featuredText.value}
                htmlSerializer={defaultSerializer}
              />
            </div>
          </SpacingSection>
        </Layout8>
      )}
      {pageId === 'XvxzjhQAAJmq1t__' && <VisitUsStaticContent />}
      {pageId === 'X2jSjBMAACIA8Wq_' && <CollectionsStaticContent />}

      {sections.map((section, index) => {
        const isFirst = index === 0;
        const isLast = index === sections.length - 1;
        const sectionTheme = sectionThemes[index % sectionThemes.length];
        const hasFeatured =
          Boolean(section.value.hasFeatured) ||
          section.value.items.length === 1;
        const firstItem = section.value.items?.[0];
        const isCardType = firstItem?.type === 'card';

        const firstItemProps =
          firstItem &&
          (isCardType
            ? convertCardToFeaturedCardProps(firstItem)
            : convertItemToFeaturedCardProps(firstItem));

        const cardItems = hasFeatured
          ? section.value.items.slice(1)
          : section.value.items;
        const featuredItem =
          hasFeatured && firstItem ? (
            <FeaturedCard
              {...firstItemProps}
              background={sectionTheme.featuredCardBackground}
              color={sectionTheme.featuredCardText}
              isReversed={false}
            >
              <h2 className="font-wb font-size-2">{firstItem.title}</h2>
              {isCardType && firstItem.description && (
                <p className="font-hnl font-size-5">{firstItem.description}</p>
              )}
              {firstItem.promo && (
                <p className="font-hnl font-size-5">
                  {firstItem.promo.caption}
                </p>
              )}
            </FeaturedCard>
          ) : null;

        const cards = cardItems.map((item, i) => {
          const cardProps =
            item.type === 'card' ? item : convertItemToCardProps(item);
          return <Card key={i} item={cardProps} />;
        });

        return (
          <ConditionalWrapper
            key={index}
            condition={!isLast}
            wrapper={children => <SpacingSection>{children}</SpacingSection>}
          >
            {!isFirst && (
              <WobblyEdge background={sectionTheme.rowBackground} isStatic />
            )}
            <Space
              v={{
                size: 'xl',
                properties: isLast
                  ? ['padding-top']
                  : ['padding-top', 'padding-bottom'],
              }}
              className={classNames({
                'row card-theme': true,
                [`bg-${sectionTheme.rowBackground}`]: true,
                [`card-theme--${sectionTheme.cardBackground}`]: true,
              })}
            >
              {section.value.title && (
                <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                  <SectionHeader title={section.value.title} />
                </Space>
              )}
              {featuredItem && (
                <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                  <Layout12>{featuredItem}</Layout12>
                </Space>
              )}
              {cards.length > 0 && <GridFactory items={cards} />}
            </Space>

            {!isLast && <WobblyEdge background={'white'} isStatic />}
          </ConditionalWrapper>
        );
      })}
    </div>
  );
};

export default Body;
