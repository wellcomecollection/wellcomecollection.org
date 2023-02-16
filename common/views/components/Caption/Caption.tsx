import * as prismicT from '@prismicio/types';
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

  p {
    display: inline;
  }
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
  caption: prismicT.RichTextField;
  preCaptionNode?: ReactNode;
  width?: number;
  isFigcaption?: boolean;
};

const Caption: FunctionComponent<Props> = ({
  caption,
  preCaptionNode,
  width,
  isFigcaption = true,
}: Props) => {
  return (
    <Wrapper
      width={width}
      as={isFigcaption ? 'figcaption' : undefined}
      aria-hidden={isFigcaption ? undefined : 'true'}
      style={width ? { width: `${width}px` } : undefined}
    >
      <CaptionWrapper>
        {preCaptionNode}
        <CaptionText>
          <PrismicHtmlBlock html={caption} />
        </CaptionText>
      </CaptionWrapper>
    </Wrapper>
  );
};

export default Caption;
