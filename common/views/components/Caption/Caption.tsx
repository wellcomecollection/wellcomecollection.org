import * as prismic from '@prismicio/client';
import { font } from '../../../utils/classnames';
import { FunctionComponent, ReactNode } from 'react';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '../styled/Space';
import styled from 'styled-components';

const CaptionText = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left'] },
})`
  text-align: left;
  border-left: 1px solid currentColor;
`;

const CaptionWrapper = styled.div`
  overflow: hidden;
  max-width: 55em;
  margin: 0 auto;
`;

const Wrapper = styled(Space).attrs({
  v: {
    size: 'm',
    properties: ['margin-top'],
  },
  className: `${font('lr', 6)} caption`,
})<{ width?: number }>`
  ${props => (props.width ? `width: ${props.width}px;` : '')}

  margin-left: auto;
  margin-right: auto;
`;

type Props = {
  caption: prismic.RichTextField;
  preCaptionNode?: ReactNode;
  width?: number;
};

const Caption: FunctionComponent<Props> = ({
  caption,
  preCaptionNode,
  width,
}: Props) => {
  return (
    // In order to be valid html, a figcaption should appear as the first or
    // last element in a figure. We have previously made this happen
    // (https://github.com/wellcomecollection/wellcomecollection.org/pull/9103)
    // but we have since discovered that Firefox will read the figcaption
    // _before_ the img alt unless the figcaption is wrapped. On balance, it
    // makes sense to have more accessible markup at the expense of it being
    // less valid.
    <Wrapper width={width}>
      <figcaption>
        <CaptionWrapper>
          {preCaptionNode}
          <CaptionText>
            <PrismicHtmlBlock html={caption} />
          </CaptionText>
        </CaptionWrapper>
      </figcaption>
    </Wrapper>
  );
};

export default Caption;
