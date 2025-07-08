import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { arrowSmall } from '@weco/common/icons';
import { getCrop } from '@weco/common/model/image';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import Button from '@weco/common/views/components/Buttons';
import LabelsList from '@weco/common/views/components/LabelsList';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';
import { Season } from '@weco/content/types/seasons';
import DateRange from '@weco/content/views/components/DateRange';

type CardOuterProps = {
  $background: 'neutral.700' | 'warmNeutral.300';
};

const CardOuter = styled.a<CardOuterProps>`
  display: flex;
  flex-direction: column-reverse;
  overflow: hidden;
  text-decoration: none;
  background: ${props => props.theme.color(props.$background)};
  color: ${props =>
    props.theme.color(
      props.$background === 'neutral.700' ? 'warmNeutral.300' : 'black'
    )};

  ${props => props.theme.media('large')`
    flex-direction: row;
  `}
`;

const TextWrapper = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
})<{
  $highlightColor: 'yellow' | 'accent.salmon';
}>`
  border-left: 4px solid ${props => props.theme.color(props.$highlightColor)};
  ${props => props.theme.media('large')`
    flex-grow: 2;
  `};
`;

type ImageWrapperProps = {
  $imageUrl: string;
};

const ImageWrapper = styled.div<ImageWrapperProps>`
  background-image: url(${props => props.$imageUrl});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center top;
  height: 300px;
  ${props => props.theme.media('large')`
    background-position: center center;
    height: auto;
    min-width: 38%;
  `};
`;

const DateRangeWrapper = styled(Space).attrs({
  className: font('intr', 5),
  $v: { size: 's', properties: ['margin-top', 'margin-bottom'] },
})`
  color: ${props => props.theme.color('neutral.400')};
`;

function getTypeLabel(type: 'seasons') {
  switch (type) {
    case 'seasons':
      return 'Season';
    default:
      return null;
  }
}

type Props = {
  item: Season;
  background?: 'neutral.700' | 'warmNeutral.300';
  highlightColor?: 'yellow' | 'accent.salmon';
};

const BannerCard: FunctionComponent<Props> = ({
  item,
  background = 'neutral.700',
  highlightColor = 'accent.salmon',
}: Props) => {
  const { type, title, start, end, description, image, link } = {
    type: getTypeLabel(item.type),
    title: item.title,
    start: item.start,
    end: item.end,
    description: item.promo && item.promo.caption,
    image: item.promo &&
      item.promo.image && {
        contentUrl: item.promo.image.contentUrl,
        // We intentionally omit the alt text on promos, so screen reader
        // users don't have to listen to the alt text before hearing the
        // title of the item in the list.
        //
        // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
        alt: '',
        width: 1600,
        height: 900,
        tasl: item.promo.image.tasl,
        crops: {
          '16:9': {
            contentUrl: getCrop(item.image, '16:9')?.contentUrl || '',
            alt: '',
            width: 1600,
            height: 900,
            crops: {},
            tasl: item.promo.image.tasl,
          },
        },
      },
    link:
      (item.promo && item.promo.link) ||
      linkResolver({ uid: item.uid, type: item.type }),
  };
  return (
    <CardOuter href={link} $background={background}>
      <TextWrapper $highlightColor={highlightColor}>
        {type && (
          <LabelsList
            labels={[{ text: type }]}
            defaultLabelColor="accent.salmon"
          />
        )}
        <Space
          as="h2"
          className={font('wb', 2)}
          $v={{ size: 'm', properties: ['margin-top', 'margin-bottom'] }}
        >
          {title}
        </Space>
        {start && end && (
          <DateRangeWrapper>
            <DateRange start={start} end={end} />
          </DateRangeWrapper>
        )}
        <p className={font('intr', 5)}>{description}</p>
        <Button
          variant="ButtonSolid"
          colors={themeValues.buttonColors.whiteTransparentWhite}
          isIconAfter={true}
          icon={arrowSmall}
          text={`Explore ${type}`}
        />
      </TextWrapper>
      {image && (
        <ImageWrapper $imageUrl={convertImageUri(image.contentUrl, 640)} />
      )}
    </CardOuter>
  );
};

export default BannerCard;
