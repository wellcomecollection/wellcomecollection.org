import { HTMLString } from '../../../services/prismic/types';
import { font, classNames } from '../../../utils/classnames';
import { ReactElement, FC } from 'react';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '../styled/Space';
import styled from 'styled-components';

const CaptionWrapper = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left'] },
})`
  text-align: left;
  border-left: 1px solid ${props => props.theme.color('currentColor')};
`;

type Props = {
  caption: HTMLString;
  preCaptionNode?: ReactElement;
  width?: number | null | undefined;
};

const Caption: FC<Props> = ({
  caption,
  preCaptionNode,
  width,
}: Props) => {
  return (
    <Space
      v={{
        size: 'm',
        properties: ['margin-top'],
      }}
      as="figcaption"
      style={width ? { width: `${width}px` } : undefined}
      className={classNames({
        [font('lr', 6)]: true,
        'caption h-center': true,
      })}
    >
      <div
        className={classNames({
          'overflow-hidden': true,
        })}
        style={{ maxWidth: '55em' }}
      >
        {preCaptionNode}
        <CaptionWrapper>
          <PrismicHtmlBlock html={caption} />
        </CaptionWrapper>
        <style>{'.caption p { display: inline; }'}</style>
      </div>
    </Space>
  );
};

export default Caption;
