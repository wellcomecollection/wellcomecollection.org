import superagent from 'superagent';
import { createTweet } from '../model/tweet';

async function getTwitterAccessToken() {
  // TODO: reimplement after testing
  const urlEncodedK = encodeURIComponent('qpsVJlsTg22FFKr1fwzkzU4Ew');
  const urlEncodedS = encodeURIComponent('kmXPnluTYkl7oH4mRlC1EgthH8KLT9mBpezgK3wBaFQviC23Ru');
  const base64EncodedKS = Buffer.from(`${urlEncodedK}:${urlEncodedS}`).toString('base64');
  const accessToken = await superagent.post('https://api.twitter.com/oauth2/token')
    .set('Authorization', `Basic ${base64EncodedKS}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send('grant_type=client_credentials')
    .then(data => data.body.access_token);

  return accessToken;
}

async function getLatestTweetDetails(count) {
  const accessToken = await getTwitterAccessToken();
  const latestTweetDetails = await superagent.get(`https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=explorewellcome&count=${count}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .then(data => {
      return data.body.map(i => {
        return {
          id: i.id_str,
          text: i.text,
          screenName: i.user.screen_name,
          createdAt: new Date(i.created_at)
        };
      });
    });

  return latestTweetDetails;
}

export async function getLatestTweets(count) {
  const detailsArray = await getLatestTweetDetails(count);

  return detailsArray.map((details) => {
    const dateString = details.createdAt.toLocaleString('en-GB', {year: 'numeric', month: 'long', day: 'numeric'});
    // create the markup that the Twitter oEmbed API will convert into an embedded tweet
    const embedTweetHtml = `<blockquote class="twitter-tweet">
      <p lang="en">${details.text}</p>
      <a href="https://twitter.com/${details.screenName}/status/${details.id}">${dateString}</a>
    </blockquote>`;

    return createTweet({
      id: details.id,
      screenName: details.screenName,
      createdAt: details.createdAt,
      html: embedTweetHtml
    });
  });
}
