import { FunctionComponent } from 'react';
import { font } from '@weco/common/utils/classnames';
import { ExhibitionGuideBasic } from '../../types/exhibition-guides';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import styled from 'styled-components';

const ImageWrapper = styled.div`
  position: relative;
`;

const Type = styled(Space).attrs({
  as: 'li',
  $v: { size: 'm', properties: ['margin-bottom'] },
})`
  text-decoration: none;
`;

const ExhibitionTitleLink = styled.a`
  text-decoration: none;
`;

const TypeListItem = ({ url, text }) => {
  return (
    <Type>
      <a href={url}>{text}</a>
    </Type>
  );
};

type Props = {
  exhibitionGuide: ExhibitionGuideBasic;
};

// We use this Promo for Exhibition Guides when we want to link to the individual types within a guide
// and not just the guide itself
const ExhibitionGuideLinksPromo: FunctionComponent<Props> = ({
  exhibitionGuide,
}) => {
  const links: { url: string; text: string }[] = [];
  if (exhibitionGuide.availableTypes.audioWithoutDescriptions) {
    links.push({
      url: `/guides/exhibitions/${
        exhibitionGuide.exhibitionHighlightTourId || exhibitionGuide.id
      }/audio-without-descriptions`,
      text: 'Listen to audio',
    });
  }
  if (exhibitionGuide.availableTypes.captionsOrTranscripts) {
    links.push({
      url: `/guides/exhibitions/${
        exhibitionGuide.exhibitionTextId || exhibitionGuide.id
      }/captions-and-transcripts`,
      text: 'Read captions and transcriptions',
    });
  }
  if (exhibitionGuide.availableTypes.BSLVideo) {
    links.push({
      url: `/guides/exhibitions/${
        exhibitionGuide.exhibitionHighlightTourId || exhibitionGuide.id
      }/bsl`,
      text: 'Watch British Sign Language videos',
    });
  }
  return (
    <>
      <ExhibitionTitleLink href={`/guides/exhibitions/${exhibitionGuide.id}`}>
        {exhibitionGuide.promo?.image && (
          <ImageWrapper>
            <PrismicImage
              // We intentionally omit the alt text on promos, so screen reader
              // users don't have to listen to the alt text before hearing the
              // title of the item in the list.
              image={{
                ...exhibitionGuide.promo.image,
                alt: '',
              }}
              sizes={{
                xlarge: 1 / 4,
                large: 1 / 3,
                medium: 1 / 2,
                small: 1,
              }}
              quality="low"
            />
          </ImageWrapper>
        )}

        <Space
          $v={{
            size: 'm',
            properties: ['margin-top', 'margin-bottom'],
          }}
          as="h3"
          className={font('wb', 3)}
        >
          {exhibitionGuide.title}
        </Space>
      </ExhibitionTitleLink>
      <Space $v={{ size: 's', properties: ['margin-top'] }}>
        <PlainList className={font('intr', 5)}>
          {links.map((link, i) => (
            <TypeListItem key={i} url={link.url} text={link.text} />
          ))}
        </PlainList>
      </Space>
    </>
  );
};

export default ExhibitionGuideLinksPromo;
