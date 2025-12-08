import { FunctionComponent } from 'react';
import styled from 'styled-components';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { ExhibitionGuideBasic } from '@weco/content/types/exhibition-guides';
const ImageWrapper = styled.div`
  position: relative;
`;

const Type = styled(Space).attrs({
  as: 'li',
  $v: { size: 'sm', properties: ['margin-bottom'] },
})`
  text-decoration: none;
`;

const ExhibitionTitleLink = styled.a`
  text-decoration: none;
`;

type Props = {
  exhibitionGuide: ExhibitionGuideBasic;
};

// We use this Promo for Exhibition Guides when we want to link to the individual types within a guide
// and not just the guide itself
const ExhibitionGuideLinksCard: FunctionComponent<Props> = ({
  exhibitionGuide,
}) => {
  const links: { url: string; text: string }[] = [];
  if (exhibitionGuide.availableTypes.audioWithoutDescriptions) {
    links.push({
      url: `${linkResolver({ ...exhibitionGuide, uid: exhibitionGuide.exhibitionHighlightTourUid || exhibitionGuide.uid, highlightTourType: 'audio' })}`,
      text: 'Listen to audio',
    });
  }
  if (exhibitionGuide.availableTypes.captionsOrTranscripts) {
    links.push({
      url: `${linkResolver({ ...exhibitionGuide, uid: exhibitionGuide.exhibitionTextUid || exhibitionGuide.uid, highlightTourType: 'text' })}`,
      text: 'Read captions and transcriptions',
    });
  }
  if (exhibitionGuide.availableTypes.BSLVideo) {
    links.push({
      url: `${linkResolver({ ...exhibitionGuide, uid: exhibitionGuide.exhibitionHighlightTourUid || exhibitionGuide.uid, highlightTourType: 'bsl' })}`,
      text: 'Watch British Sign Language videos',
    });
  }
  return (
    <>
      <ExhibitionTitleLink href={linkResolver(exhibitionGuide)}>
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
          $v={{ size: 'sm', properties: ['margin-top', 'margin-bottom'] }}
          as="h3"
          className={font('brand', 1)}
        >
          {exhibitionGuide.title}
        </Space>
      </ExhibitionTitleLink>
      <Space $v={{ size: '2xs', properties: ['margin-top'] }}>
        <PlainList className={font('sans', -1)}>
          {links.map((link, i) => (
            <Type key={i}>
              <a href={link.url}>{link.text}</a>
            </Type>
          ))}
        </PlainList>
      </Space>
    </>
  );
};

export default ExhibitionGuideLinksCard;
