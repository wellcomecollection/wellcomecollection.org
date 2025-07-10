import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';

export const VenueHoursImage = styled(Space)`
  ${props => props.theme.media('medium')`
    width: 50%;
  `}
  ${props =>
    props.theme.media('large')(`
      float: left;
      width: 33%;
      padding-right: ${5 * props.theme.spacingUnit}px;
    `)}
`;

export const VenueHoursTimes = styled(Space)`
  ${props =>
    props.theme.media('medium')(`
      float: left;
      width: 33%;
      min-width: 240px;
      padding-right: ${5 * props.theme.spacingUnit}px;
    `)}
`;

type JauntyBoxProps = {
  $topLeft: string;
  $topRight: string;
  $bottomLeft: string;
  $bottomRight: string;
};
export const JauntyBox = styled(Space)<JauntyBoxProps>`
  display: inline-block;
  background-color: ${props => props.theme.color('yellow')};
  padding-left: 30px;
  padding-right: 42px;
  margin-left: -12px;
  margin-right: -12px;

  ${props =>
    props.theme.media('medium')(`
      margin-left: -24px;
      margin-right: -24px;
    `)}

  clip-path: ${({ $topLeft, $topRight, $bottomRight, $bottomLeft }) =>
    `polygon(
      ${$topLeft} ${$topLeft},
      calc(100% - ${$topRight}) ${$topRight},
      100% calc(100% - ${$bottomRight}),
      ${$bottomLeft} 100%
    )`};
`;

// This is chosen to be wider than the names of days of the week
// (in particular 'Wednesday'), but not so wide as to leave lots
// of space between the name and the opening hours.
//
// The exact value is somewhat arbitrary, based on what looked okay locally.
export const DayOfWeek = styled.div`
  display: inline-block;
  width: 100px;
`;

export const OverrideDay = styled.div`
  display: inline-block;
  width: 200px;
`;

export const OpeningHours = styled(PlainList).attrs({
  className: font('intr', 5),
})``;

export const DifferentToRegularTime = styled.span`
  font-weight: bold;
`;
