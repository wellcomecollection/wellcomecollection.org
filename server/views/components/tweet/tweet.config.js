import { createTweet } from '../../../model/tweet';

export const name = 'Tweet';
export const handle = 'tweet';
export const status = 'graduated';
const tweet = createTweet({
  html: `<blockquote class="twitter-tweet" width="500"><p><a href="https://twitter.com/RussellDornan">@RussellDornan</a> Unless there's a reason not to (e.g. lighting is poor, or I can buy/access a pic of the object) then I'm taking my own photo.</p><p>— Taras Young (@tarasyoung) <a href="https://twitter.com/tarasyoung/status/537261773246959617">November 25, 2014</a></p></blockquote><p><script async="" src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>
</blockquote>`
});

export const context = {
  model: tweet
};
