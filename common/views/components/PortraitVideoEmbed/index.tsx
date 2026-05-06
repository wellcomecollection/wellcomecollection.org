import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { play } from '@weco/common/icons';
import { ImageType } from '@weco/common/model/image';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';

type Props = {
  posterImage?: ImageType;
  duration?: string;
  title?: string;
  onOpen: () => void;
};

const CardButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  cursor: pointer;
  text-align: left;
  background: none;
`;

const PosterContainer = styled.span`
  display: block;
  position: relative;
  padding-bottom: 177.78%; /* 9:16 portrait */
  height: 0;
  overflow: hidden;
  background: ${props => props.theme.color('black')};
`;

const PosterImageWrapper = styled.span`
  display: block;
  position: absolute;
  inset: 0;

  img {
    height: 100%;
    object-fit: cover;
  }
`;

const ControlsOverlay = styled(Space).attrs({
  $v: { size: 'xs', properties: ['bottom'] },
  $h: { size: 'xs', properties: ['left'] },
  as: 'span',
})<{ hasDuration: boolean }>`
  position: absolute;
  display: flex;
  align-items: center;
  ${props => props.theme.makeSpacePropertyValues('xs', ['column-gap'])};
  padding: 3px ${props => (props.hasDuration ? '10px' : '3px')} 3px 3px;
  background: ${props => props.theme.color('black')};
  border-radius: 9999px;
`;

const PlayCircle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.color('white')};
  background: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
`;

const DurationText = styled.span.attrs({
  className: font('sans', -1),
})`
  color: ${props => props.theme.color('white')};
`;

const CardTitle = styled(Space).attrs({
  $v: { size: 'xs', properties: ['margin-top'] },
  as: 'span',
  className: font('sans', -1),
})`
  display: block;
  line-height: 1.6;

  ${CardButton}:hover & {
    text-decoration: underline;
  }
`;

const PortraitVideoEmbed: FunctionComponent<Props> = ({
  posterImage,
  duration,
  title,
  onOpen,
}) => (
  <div data-component="portrait-video-embed">
    <CardButton type="button" onClick={onOpen}>
      <span style={{ display: 'block' }}>
        <PosterContainer>
          {posterImage && (
            <PosterImageWrapper>
              <PrismicImage
                image={{ ...posterImage, alt: null }}
                quality="low"
              />
            </PosterImageWrapper>
          )}
          <ControlsOverlay hasDuration={!!duration} aria-hidden="true">
            <PlayCircle>
              <Icon
                icon={play}
                sizeOverride="width: 11px; height: 11px; left: 1px;"
              />
            </PlayCircle>
            {duration && <DurationText>{duration}</DurationText>}
          </ControlsOverlay>
        </PosterContainer>

        {title ? (
          <CardTitle>{title}</CardTitle>
        ) : (
          <span className="visually-hidden">Play video</span>
        )}
      </span>
    </CardButton>
  </div>
);

export default PortraitVideoEmbed;
