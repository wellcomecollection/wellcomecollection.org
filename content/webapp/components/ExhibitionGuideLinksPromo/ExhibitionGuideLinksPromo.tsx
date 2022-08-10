import { FC } from 'react';
import { font, classNames } from '@weco/common/utils/classnames';
import { ExhibitionGuideBasic } from '../../types/exhibition-guides';
import Space from '@weco/common/views/components/styled/Space';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import styled from 'styled-components';

const Type = styled(Space).attrs({
  as: 'li',
  v: { size: 'm', properties: ['margin-bottom'] },
})``;

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
// and not the guide itself
const ExhibitionGuideLinksPromo: FC<Props> = ({ exhibitionGuide }) => {
  const links = [
    {
      url: `/guides/exhibitions/${exhibitionGuide.id}/audio-without-descriptions`,
      text: 'List to audio guide, without audio description',
    },
    {
      url: `/guides/exhibitions/${exhibitionGuide.id}/audio-with-descriptions`,
      text: 'List to audio guide, with audio description',
    },
    {
      url: `/guides/exhibitions/${exhibitionGuide.id}/captions-and-transcripts`,
      text: 'Read captions and transcriptions',
    },
    {
      url: `/guides/exhibitions/${exhibitionGuide.id}/bsl`,
      text: 'Watch BSL videos',
    },
  ];
  return (
    <div>
      <div className="relative">
        {exhibitionGuide.promo?.image && (
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
        )}
      </div>

      <div>
        <Space
          v={{
            size: 'm',
            properties: ['margin-top', 'margin-bottom'],
          }}
          as="h3"
          className={classNames({
            [font('wb', 3)]: true,
          })}
        >
          {exhibitionGuide.title}
        </Space>
        {exhibitionGuide.promo?.caption && (
          <Space v={{ size: 's', properties: ['margin-top'] }}>
            <ul
              className={classNames({
                [font('hnr', 5)]: true,
                'no-margin plain-list no-padding': true,
              })}
            >
              {links.map((link, i) => (
                <TypeListItem key={i} url={link.url} text={link.text} />
              ))}
            </ul>
          </Space>
        )}
      </div>
    </div>
  );
};

export default ExhibitionGuideLinksPromo;
