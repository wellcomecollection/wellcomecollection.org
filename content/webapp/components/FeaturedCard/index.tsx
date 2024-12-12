import { FunctionComponent, PropsWithChildren } from 'react';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { font, grid } from '@weco/common/utils/classnames';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';
import DateRange from '@weco/content/components/DateRange/DateRange';
import StatusIndicator from '@weco/content/components/StatusIndicator/StatusIndicator';
import { Article } from '@weco/content/services/wellcome/content/types/api';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';

import {
  convertCardToFeaturedCardProps,
  convertItemToFeaturedCardProps,
  PartialFeaturedCard,
} from './FeaturedCard.helpers';
import {
  DateWrapper,
  FeaturedCardCopy,
  FeaturedCardLeft,
  FeaturedCardLink,
  FeaturedCardRight,
  FeaturedCardShim,
  FeaturedCardWrap,
} from './FeaturedCard.styles';

type FeaturedCardProps = PartialFeaturedCard & {
  background: PaletteColor;
  textColor: PaletteColor;
  isReversed?: boolean;
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

const FeaturedCardBasic = props => {
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

export const FeaturedCardExhibition: FunctionComponent<
  FeaturedCardExhibitionProps
> = ({ exhibition, background, textColor }) => {
  const props = convertItemToFeaturedCardProps(exhibition);

  return (
    <FeaturedCardBasic {...props} background={background} textColor={textColor}>
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
    </FeaturedCardBasic>
  );
};

const FeaturedCard: FunctionComponent<
  | PropsWithChildren<FeaturedCardProps & { type?: 'card' }>
  | (FeaturedCardArticleProps & { type: 'article' })
  | (FeaturedCardExhibitionProps & { type: 'exhibition' })
> = props => {
  if (props.type === 'article') {
    return (
      <FeaturedCardArticle
        article={props.article}
        background={props.background}
        textColor={props.textColor}
      />
    );
  }

  if (props.type === 'exhibition') {
    return (
      <FeaturedCardExhibition
        exhibition={props.exhibition}
        background={props.background}
        textColor={props.textColor}
      />
    );
  }

  return <FeaturedCardBasic {...props} />;
};

export default FeaturedCard;
export { convertCardToFeaturedCardProps, convertItemToFeaturedCardProps };
