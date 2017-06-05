/* eslint-disable no-irregular-whitespace */
import { createTweet } from '../../../model/tweet';
import { createInstagramEmbed } from '../../../model/instagram-embed';

export const status = 'testing';

const instagramPost = createInstagramEmbed({
  html: `<blockquote class="instagram-media" data-instgrm-captioned="" data-instgrm-version="7" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:500px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"><div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50% 0; text-align:center; width:100%;"><div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAMUExURczMzPf399fX1+bm5mzY9AMAAADiSURBVDjLvZXbEsMgCES5/P8/t9FuRVCRmU73JWlzosgSIIZURCjo/ad+EQJJB4Hv8BFt+IDpQoCx1wjOSBFhh2XssxEIYn3ulI/6MNReE07UIWJEv8UEOWDS88LY97kqyTliJKKtuYBbruAyVh5wOHiXmpi5we58Ek028czwyuQdLKPG1Bkb4NnM+VeAnfHqn1k4+GPT6uGQcvu2h2OVuIf/gWUFyy8OWEpdyZSa3aVCqpVoVvzZZ2VTnn2wU8qzVjDDetO90GSy9mVLqtgYSy231MxrY6I2gGqjrTY0L8fxCxfCBbhWrsYYAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div><p style=" margin:8px 0 0 0; padding:0 4px;"><a href="https://www.instagram.com/p/vYmUpdGfC6/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">Since it's Friday, here's another #behindthescenes #tease of our upcoming #Sexology exhibition. A little #peepshow if you will. #WellcomeCollection #installation #exhibition #museum #instamuseum</a></p><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A photo posted by Wellcome Collection (@wellcomecollection) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2014-11-14T14:59:11+00:00">Nov 14, 2014 at 6:59am PST</time></p></div></blockquote>`
});

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

export const name = 'social-media-block';
export const preview = '@preview-no-container';
export const context = {
  model: {
    service: 'Twitter',
    handle: 'explorewellcome',
    icon: 'social/twitter',
    url: 'https://twitter.com/explorewellcome',
    posts: [tweet1, tweet2, tweet3, tweet4]
  }
};

export const variants = [
  {
    name: 'Instagram',
    context: {
      model: {
        service: 'Instagram',
        handle: 'explorewellcome',
        icon: 'social/instagram',
        url: '#',
        posts: [instagramPost, instagramPost, instagramPost, instagramPost]
      }
    }
  }
];
