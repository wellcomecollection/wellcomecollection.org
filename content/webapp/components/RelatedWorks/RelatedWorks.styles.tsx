import styled, { css } from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const FullWidthRow = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

const clampLineStyles = css<{ $linesToClamp: number }>`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: ${props => props.$linesToClamp};
`;

export const Card = styled.a`
  display: flex;
  padding: ${props => props.theme.spacingUnits['3']}px;
  background-color: ${props => props.theme.color('white')};
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  flex-wrap: wrap;
  text-decoration: none;

  ${props => props.theme.media('medium')`
    height: 10rem;
    flex-wrap: nowrap;
    justify-content: space-between;
  `}
`;

export const TextWrapper = styled.div`
  display: flex;
  padding-top: ${props => props.theme.spacingUnits['5']}px;
  flex-direction: column;
  width: 100%;
  container-type: inline-size;
  container-name: text-wrapper;

  ${props => props.theme.media('medium')`
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

    ${props => props.theme.media('medium')`
      width: unset;
      height: 100%;
      max-height: unset;

      max-width: -webkit-fill-available;
      max-width: -moz-available;
      max-width: stretch;

      /*
      This is a hack to target Safari only, because -webkit-fill-available is
      the property that _should_ work and is required for Chrome > 138 but causes
      Safari to hide images completely
      */
      @supports (-webkit-appearance: none) and (stroke-color: transparent) {
        max-width: 100%;
      }
    `}
  }

  ${props => props.theme.media('medium')`
    max-height: unset;
    width: unset;
    max-width: 50%;
    order: unset;
    display: flex;
    justify-content: end;
  `}
`;

export const MetaContainer = styled.div.attrs({
  className: font('intr', 6),
})`
  color: ${props => props.theme.color('neutral.600')};
`;
