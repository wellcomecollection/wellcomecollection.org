// @flow
import superagent from 'superagent';

export async function getEventbriteEventEmbed(id: string) {
  const iframeContent = await superagent.get(`https://eventbrite.com/tickets-external?eid=${id}&ref=etckt`);
  return iframeContent.text;
}
// TODO https://eventbrite.co.uk/tickets-external?eid=47946583522&ref=etckt
