// @flow
import superagent from 'superagent';

export async function getEventbriteEventEmbed(id: string) {
  const iframeContent = await superagent.get(`https://eventbrite.com/tickets-external?eid=${id}&ref=etckt`);
  return iframeContent.text;
}
