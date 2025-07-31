import { FunctionComponent, PropsWithChildren } from 'react';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { font } from '@weco/common/utils/classnames';
import LabelsList from '@weco/common/views/components/LabelsList';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';
import { Article } from '@weco/content/services/wellcome/content/types/api';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import DateRange from '@weco/content/views/components/DateRange';
import StatusIndicator from '@weco/content/views/components/StatusIndicator';

import {
  convertCardToFeaturedCardProps,
  convertItemToFeaturedCardProps,
  PartialFeaturedCard,
} from './FeaturedCard.helpers';
import {
  DateWrapper,
  FeaturedCardCopy,
  FeaturedCardLabelWrap,
  FeaturedCardLeft,
  FeaturedCardLink,
  FeaturedCardRight,
  FeaturedCardRightWrap,
  FeaturedCardShim,
  FeaturedCardWrap,
} from './FeaturedCard.styles';

type FeaturedCardProps = PartialFeaturedCard & {
  background: PaletteColor;
  textColor: PaletteColor;
  isReversed?: boolean;
  children: React.ReactNode;
};

type FeaturedCardArticleProps = {
  article: Article;
  background: PaletteColor;
  textColor: PaletteColor;
};

type FeaturedCardExhibitionProps = {
  exhibition: ExhibitionBasic;
  background: PaletteColor;
  textColor: PaletteColor;
};

const FeaturedCardBasic: FunctionComponent<FeaturedCardProps> = props => {
  const {
    image,
    labels,
    children,
    link,
    textColor,
    background,
    isReversed = false,
  } = props;

  return (
    <FeaturedCardWrap data-component="featured-card">
      <FeaturedCardLink href={link.url} $isReversed={isReversed}>
        <FeaturedCardLeft
          $sizeMap={{
            s: [12],
            m: [12],
            l: [7],
            xl: [7],
          }}
          $isReversed={isReversed}
        >
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
        <FeaturedCardRightWrap
          $sizeMap={{
            s: [12],
            m: [11, 2],
            l: [5],
            xl: [5],
          }}
          $isReversed={isReversed}
        >
          <FeaturedCardRight $isReversed={isReversed}>
            {labels && labels.length > 0 ? (
              <FeaturedCardLabelWrap $isReversed={isReversed}>
                <LabelsList labels={labels} />
              </FeaturedCardLabelWrap>
            ) : (
              <div style={{ marginBottom: '26px' }} />
            )}
            <FeaturedCardCopy $background={background} $textColor={textColor}>
              {children}
            </FeaturedCardCopy>
            <FeaturedCardShim $background={background} />
          </FeaturedCardRight>
        </FeaturedCardRightWrap>
      </FeaturedCardLink>
    </FeaturedCardWrap>
  );
};

const FeaturedCardArticle: FunctionComponent<FeaturedCardArticleProps> = ({
  article,
  background,
  textColor,
  ...rest
}) => {
  const promoImage = article.image?.['16:9'] || article.image;
  const image = promoImage && {
    ...transformImage(promoImage),
    alt: '',
  };
  const link = {
    url: linkResolver({ type: 'articles', uid: article.uid }),
    text: article.title,
  };
  const labels = [{ text: article.format.label }];

  return (
    <FeaturedCardBasic
      data-component="featured-card"
      {...rest}
      image={image}
      link={link}
      labels={labels}
      background={background}
      textColor={textColor}
    >
      <h2 className={font('wb', 2)}>{article.title}</h2>
      {article.caption && <p className={font('intr', 5)}>{article.caption}</p>}
      {article.seriesTitle && (
        <Space $v={{ size: 'l', properties: ['margin-top'] }}>
          <p className={font('intb', 6)} style={{ marginBottom: 0 }}>
            <span className={font('intr', 6)}>Part of</span>{' '}
            {article.seriesTitle}
          </p>
        </Space>
      )}
    </FeaturedCardBasic>
  );
};

const FeaturedCardExhibition: FunctionComponent<
  FeaturedCardExhibitionProps
> = ({ exhibition, background, textColor, ...rest }) => {
  const props = convertItemToFeaturedCardProps(exhibition);

  return (
    <FeaturedCardBasic
      data-component="featured-card"
      {...rest}
      {...props}
      background={background}
      textColor={textColor}
    >
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
        {exhibition.promo?.caption && (
          <p className={font('intr', 5)} style={{ marginTop: '1rem' }}>
            {exhibition.promo.caption}
          </p>
        )}
      </div>
    </FeaturedCardBasic>
  );
};

const FeaturedCard: FunctionComponent<
  | PropsWithChildren<FeaturedCardProps & { type?: 'card' }>
  | (FeaturedCardArticleProps & { type: 'article' })
  | (FeaturedCardExhibitionProps & { type: 'exhibition' })
> = props => {
  if (props.type === 'article') {
    return <FeaturedCardArticle {...props} />;
  }

  if (props.type === 'exhibition') {
    return <FeaturedCardExhibition {...props} />;
  }

  return <FeaturedCardBasic data-component="featured-card" {...props} />;
};

export default FeaturedCard;
export { convertCardToFeaturedCardProps, convertItemToFeaturedCardProps };
