import styled, { css } from 'styled-components';

import { font } from '@weco/common/utils/classnames';

const clampLineStyles = css<{ $linesToClamp: number }>`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: ${props => props.$linesToClamp};
`;

const minGridCellWidth = '400px';
const maxTextWrapperWidth = '270px';

export const Card = styled.a`
  display: flex;
  padding: ${props => props.theme.spacingUnits['3']}px;
  background-color: ${props => props.theme.color('white')};
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  flex-wrap: wrap;
  text-decoration: none;

  @container (min-width: ${minGridCellWidth}) {
    height: 10rem;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
`;

export const TextWrapper = styled.div`
  display: flex;
  padding-top: ${props => props.theme.spacingUnits['5']}px;
  flex-direction: column;
  width: 100%;
  container-type: inline-size;
  container-name: text-wrapper;

  @container grid-cell (min-width: ${minGridCellWidth}) {
    padding-top: 0;
  }

  li > div {
    justify-content: space-between;

    @container text-wrapper (max-width: ${maxTextWrapperWidth}) {
      max-width: 116px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export const Title = styled.h2.attrs({
  className: font('intb', 5),
})<{ $linesToClamp: number }>`
  ${clampLineStyles};
  margin-top: ${props => props.theme.spacingUnits['1']}px;

  ${Card}:hover & {
    text-decoration: underline;
  }
`;

export const LineClamp = styled.div<{ $linesToClamp: number }>`
  ${clampLineStyles};
`;

export const ImageWrapper = styled.div`
  width: 100%;
  max-height: 400px;
  order: -1;
  margin-left: ${props => props.theme.spacingUnits['3']}px;

  img {
    display: block;
    object-fit: contain;
    width: 100%;
    max-height: 100%;
    filter: url('#border-radius-mask');

    @container (min-width: ${minGridCellWidth}) {
      width: unset;
      height: 100%;
      max-height: unset;
      max-width: stretch;
      justify-self: end;
    }
  }

  @container (min-width: ${minGridCellWidth}) {
    max-height: unset;
    width: unset;
    max-width: 50%;
    order: unset;
  }
`;

export const MetaContainer = styled.div.attrs({
  className: font('intr', 6),
})`
  color: ${props => props.theme.color('neutral.600')};
`;
