import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';

export const Container = styled.div`
  ${props => props.theme.media.medium`
  display: flex;
`}
`;

export const Preview = styled(Space)`
  display: flex;
  flex: 1 1 100%;
  justify-content: center;
  align-items: center;
  height: 120px;
  width: 120px;
  max-width: 120px;
  margin-bottom: ${props => props.theme.spacingUnit * 2}px;
  margin-right: 1rem;
  background-color: ${props => props.theme.color('black')};

  ${props => props.theme.media.medium`
  margin-bottom: 0;
`}
`;

export const PreviewImage = styled.img`
  max-width: calc(100% - 10px);
  max-height: calc(100% - 10px);
  width: auto;
  height: auto;
`;

export const Details = styled.div`
  flex: 1 1 100%;
  ${props => props.theme.media.medium`
  max-width: 900px;
`}
`;

export const WorkInformation = styled(Space).attrs({
  className: font('intr', 5),
  v: { size: 'xs', properties: ['margin-bottom'] },
})`
  color: ${props => props.theme.color('pewter')};
`;

export const WorkInformationItem = styled.span`
  &:not(:first-child)::before {
    content: ' | ';
    margin: 0 4px;
  }
`;

export const WorkTitleHeading = styled.h3`
  margin-bottom: 0.5rem;
`;
