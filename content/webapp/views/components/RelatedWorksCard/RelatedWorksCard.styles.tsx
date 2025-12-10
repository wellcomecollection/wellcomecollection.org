import styled, { css } from 'styled-components';

import { font } from '@weco/common/utils/classnames';

const clampLineStyles = css<{ $linesToClamp: number }>`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: ${props => props.$linesToClamp};
`;

export const Card = styled.a<{ $isHover?: boolean }>`
  display: flex;
  padding: ${props => props.theme.spacingUnits['100']};
  background-color: ${props => props.theme.color('white')};
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  flex-wrap: wrap;
  text-decoration: none;
  height: 100%;

  ${props =>
    props.$isHover &&
    `
    box-shadow: ${props.theme.basicBoxShadow};


    height: 5.25rem;
    width: 22rem;
  `}

  ${props => props.theme.media('sm')`
    max-height: 10rem;
    flex-wrap: nowrap;
    justify-content: space-between;
  `}

  ${props =>
    props.theme.media('md')(`
    max-height: unset;
    height: ${props.$isHover ? '5.25rem' : '10rem'};
  `)}
`;

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  container-type: inline-size;
  container-name: text-wrapper;

  ${props => props.theme.media('sm')`
    justify-content: space-between;
    padding-top: 0;
  `}

  ul {
    flex-wrap: nowrap;
  }

  li > div {
    justify-content: space-between;

    @container text-wrapper (min-width: 0) {
      /*
      The line below allows us to truncated the labels based on their lengths so that
      e.g. 'Archives and manuscripts' is truncated but 'Digital images' is not.
      */
      max-width: calc(100cqw - calc(var(--label-length) * 0.25ch));
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export const Title = styled.h2.attrs<{ $isHover?: boolean }>(props => ({
  className: !props.$isHover ? font('sans-bold', -1) : font('sans', -1),
}))<{ $linesToClamp: number }>`
  ${clampLineStyles};
  color: ${props => props.theme.color('black')};
  margin-top: ${props =>
    props.$isHover ? 0 : props.theme.spacingUnits['050']};

  ${Card}:hover & {
    text-decoration: underline;
  }
`;

export const LineClamp = styled.div<{ $linesToClamp: number }>`
  ${clampLineStyles};
`;

export const ImageWrapper = styled.div<{ $isHover?: boolean }>`
  width: 100%;
  max-height: 160px;
  order: -1;
  margin-bottom: ${props => props.theme.spacingUnits['200']};
  display: flex;

  ${props =>
    props.$isHover &&
    `
      flex: 1;
    `}

  img {
    display: block;
    object-fit: contain;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    filter: url('#border-radius-mask');

    ${props =>
      props.theme.media('medium')(`
      margin-left: ${props.$isHover ? '0' : props.theme.spacingUnits['100']};
      margin-right: ${props.$isHover ? props.theme.spacingUnits['100'] : 'unset'};
      width: unset;
      height: 100%;

      max-width: -webkit-fill-available; /* Chrome, Safari, Edge */
      max-width: -moz-available; /* Firefox */
      max-width: stretch; /* Future standard */

      /*
      This is a hack to target Safari only, because -webkit-fill-available is
      the property that _should_ work and is required for Chrome < 138 but causes
      Safari to hide images completely
      */
      @supports (-webkit-appearance: none) and (stroke-color: transparent) {
        max-width: 100%;

        ${
          props.$isHover &&
          `
          min-width: 60px;
        `
        }
      }
    `)}
  }

  ${props => props.theme.media('sm')`
    max-height: unset;
    width: unset;
    max-width: 50%;
    order: unset;
    display: flex;
    justify-content: end;
    margin-bottom: 0;
  `}
`;

export const MetaContainer = styled.div.attrs({
  className: font('sans', -2),
})`
  color: ${props => props.theme.color('neutral.600')};
`;
