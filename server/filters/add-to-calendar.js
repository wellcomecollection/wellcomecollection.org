// @flow
import {deP} from '../services/prismic-parsers';

type EventProps = {|
  url: string;
  startTime: Date;
  endTime: Date;
  title: string;
  description: string;
  location: string;
|}

// TODO: parse description as text, not HTML
function formatDate(date: Date): string {
  return date.toISOString().replace(/-|:|\.000/g, '');
}

export function googleCal(eventProps: EventProps): string {
  return [
    `https://calendar.google.com/calendar/render`,
    `?action=TEMPLATE`,
    `&text=${encodeURIComponent(eventProps.title)}`,
    `&dates=${formatDate(eventProps.startTime)}`,
    `/${formatDate(eventProps.endTime)}`,
    `&details=${encodeURIComponent(eventProps.description)}`,
    `&location=${encodeURIComponent(eventProps.location)}`
  ].join('');
}

export function yahooCal(eventProps: EventProps): string {
  const dur = (eventProps.endTime.getTime() - eventProps.startTime.getTime()) / (60 * 1000);
  return [
    `https://calendar.yahoo.com/?v=60&view=d&type=20`,
    `&title=${encodeURIComponent(eventProps.title)}`,
    `&st=${formatDate(eventProps.startTime)}`,
    `&dur=${dur}`,
    `&desc=${encodeURIComponent(eventProps.description)}`,
    `&in_loc=${encodeURIComponent(eventProps.location)}`
  ].join('');
}

export function outlookCal(eventProps: EventProps) {
  return [
    `https://outlook.live.com/owa/?rru=addevent`,
    `&subject=${encodeURIComponent(eventProps.title)}`,
    `&startdt=${formatDate(eventProps.startTime)}`,
    `&enddt=${formatDate(eventProps.endTime)}`,
    `&body=${encodeURIComponent(deP(eventProps.description) || '')}`,
    `&location=${encodeURIComponent(eventProps.location)}`,
    `&uid=${(new Date()).getTime().toString()}`,
    '&allday=false',
    '&path=/calendar/view/Month'
  ].join('');
}

export function iCal(eventProps: EventProps): string {
  return `data:text/calendar;charset=utf8,${encodeURIComponent([
    `BEGIN:VCALENDAR`,
    `VERSION:2.0`,
    `BEGIN:VEVENT`,
    `URL: ${eventProps.url}`,
    `DTSTART:${formatDate(eventProps.startTime)}`,
    `DTEND:${formatDate(eventProps.endTime)}`,
    `SUMMARY:${eventProps.title}`,
    `DESCRIPTION:${deP(eventProps.description) || ''}`,
    `LOCATION:${eventProps.location}`,
    `END:VEVENT`,
    `END:VCALENDAR`
  ].join('\n'))}`;
}
