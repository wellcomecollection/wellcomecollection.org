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

type Props = {
  caption: prismicT.RichTextField;
  preCaptionNode?: ReactNode;
  width?: number;
  ariaHidden?: boolean;
};

const Caption: FunctionComponent<Props> = ({
  caption,
  preCaptionNode,
  width,
  ariaHidden,
}: Props) => {
  return (
    <Space
      v={{
        size: 'm',
        properties: ['margin-top'],
      }}
      aria-hidden={ariaHidden ? 'true' : undefined}
      style={width ? { width: `${width}px` } : undefined}
      className={`${font('lr', 6)} caption h-center`}
    >
      <CaptionWrapper>
        {preCaptionNode}
        <CaptionText>
          <PrismicHtmlBlock html={caption} />
        </CaptionText>
      </CaptionWrapper>
    </Space>
  );
};

export default Caption;
