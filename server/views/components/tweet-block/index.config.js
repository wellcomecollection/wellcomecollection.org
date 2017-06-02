/* eslint-disable no-irregular-whitespace */
import { createTweet } from '../../../model/tweet';
export const status = 'testing';

const tweet1 = createTweet({
  html: `<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">We&#39;re calling out to disabled visitors to help us test designs for an upcoming exhibition. Sign up or find out more: <a href="https://t.co/tf0y8uRjiQ">https://t.co/tf0y8uRjiQ</a> <a href="https://t.co/H6Iv9uzelV">pic.twitter.com/H6Iv9uzelV</a></p>&mdash; Wellcome Collection (@ExploreWellcome) <a href="https://twitter.com/ExploreWellcome/status/870219590281945089">June 1, 2017</a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`
});
const tweet2 = createTweet({
  html: `<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">If you want to help us research <a href="https://twitter.com/hashtag/Covfefe?src=hash">#Covfefe</a>, start with this book (page 25) 😉 <a href="https://t.co/dKmVy0IBZ0">https://t.co/dKmVy0IBZ0</a></p>&mdash; Wellcome Collection (@ExploreWellcome) <a href="https://twitter.com/ExploreWellcome/status/869849452449804288">May 31, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`
});
const tweet3 = createTweet({
  html: `<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">What&#39;s <a href="https://twitter.com/hashtag/Covfefe?src=hash">#Covfefe</a>? Our collection suggests it&#39;s a demon summoned by writing its name over &amp; over again. Its powers are unclear. Bear with! 😬 <a href="https://t.co/Idk5dACcpO">pic.twitter.com/Idk5dACcpO</a></p>&mdash; Wellcome Collection (@ExploreWellcome) <a href="https://twitter.com/ExploreWellcome/status/869821762841833472">May 31, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`
});
const tweet4 = createTweet({
  html: `<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">What do you think best represents <a href="https://twitter.com/hashtag/ModernNature?src=hash">#ModernNature</a>? Let us know via our new photo project! The first theme is 🐯 WILD 🦁 <a href="https://t.co/Vf2zOhlj4n">https://t.co/Vf2zOhlj4n</a></p>&mdash; Wellcome Collection (@ExploreWellcome) <a href="https://twitter.com/ExploreWellcome/status/869516480500703236">May 30, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`
});

export const name = 'tweet-block';
export const preview = '@preview-no-container';
export const context = {
  model: {
    tweets: [tweet1, tweet2, tweet3, tweet4]
  }
};
