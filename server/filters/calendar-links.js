// @flow
type EventProps = {|
  url: string;
  startTime: Date;
  endTime: Date;
  title: string;
  description: string;
  location: string;
|}
function google(eventProps: EventProps): string {
  return [
    `https://www.google.com/calendar/render`,
    `?action=TEMPLATE`,
    `&text=${eventProps.title}`,
    '&dates=' + eventProps.startTime.toISOString(),
    `/${eventProps.endTime.toISOString()}`,
    `&details=${eventProps.description}`,
    `&location=${eventProps.location}`,
    `&sprop=&sprop=name:`
  ].join('');
}

function yahoo(eventProps: EventProps): string {

}

function ical(eventProps: EventProps): string {

}
