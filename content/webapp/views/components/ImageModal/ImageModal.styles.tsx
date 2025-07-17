import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const Container = styled.div`
  color: ${props => props.theme.color('black')};
`;

export const ImageInfoWrapper = styled.div`
  ${props => props.theme.media('large')`
    display: flex;
  `}
`;

export const MetadataWrapper = styled(Space).attrs({
  className: font('intr', 5),
  $v: { size: 's', properties: ['margin-top', 'margin-bottom'] },
})`
  color: ${props => props.theme.color('neutral.600')};
`;

export const Metadata = styled.span`
  &:not(:first-child)::before {
    content: ' | ';
    margin: 0 4px;
  }
`;

export const ModalTitle = styled.h2.attrs({
  className: font('intb', 3),
})`
  margin-bottom: 0;
`;

export const ImageWrapper = styled(Space).attrs({
  $v: { size: 'l', properties: ['margin-bottom'] },
})`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.color('black')};
  height: 50vh;

  ${props => props.theme.media('large')`
    flex: 0 1 auto;
    height: auto;
    max-height: 350px;
    margin-right: 30px;
  `};
`;

export const ImageLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 10px;
  height: 100%;

  img {
    max-width: calc(100% - 20px);
    max-height: 100%;

    /* Safari doesn't respond to max-height/width like the other browsers, we need this to ensure it's not warped. */
    object-fit: contain;
  }

  ${props => props.theme.media('large')`
    padding: 0;
    max-width: 400px;
    height: calc(100% - 20px);
    width: 100%;
    margin: auto;

    img {
      width: auto;
    }
  `}
`;

export const InfoWrapper = styled.div`
  ${props => props.theme.media('large')`
    flex: 1 0 60%;
    height: 100%;
  `}
`;

export const ViewImageButtonWrapper = styled(Space).attrs({
  $h: { size: 'm', properties: ['margin-right'] },
})`
  display: inline-block;
`;
