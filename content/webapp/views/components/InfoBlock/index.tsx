import * as prismic from '@prismicio/client';
import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';

import { typography } from '@weco/common/utils/classnames';
import { dasherize } from '@weco/common/utils/grammar';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';

const Wrapper = styled(Space).attrs({
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
})`
  border-left: 16px solid ${props => props.theme.color('yellow')};
`;

const ImageWrapper = styled(Space).attrs({
  $v: { size: 'sm', properties: ['margin-top'] },
})`
  img {
    display: block;
  }
`;

export type Props = {
  title: string;
  text: prismic.RichTextField;
  // There is no image field in the Prismic type for the infoBlock slice, we are only using it in the stories kiosk page.
  // If we decide to add it to the Prismic type, we will need to update the transformInfoBlockSlice function
  // in content/webapp/services/prismic/transformers.ts to include the image field and change this image type.
  image?: { url: string; alt?: string; width?: number; height?: number };
};

const InfoBlock: FunctionComponent<Props> = ({
  title,
  text,
  image,
}: Props): ReactElement<Props> => {
  return (
    <Wrapper data-component="info-block">
      <h2
        id={dasherize(title)}
        className={typography('heading', 'lg', 'strong', 'brand')}
      >
        {title}
      </h2>
      <div className="spaced-text body-text">
        <PrismicHtmlBlock html={text} />
      </div>
      {image && (
        <ImageWrapper>
          <img
            src={image.url}
            alt={image.alt || ''}
            width={image.width}
            height={image.height}
            style={{ width: `${image.width}px`, height: `${image.height}px` }}
          />
        </ImageWrapper>
      )}
    </Wrapper>
  );
};

export default InfoBlock;
