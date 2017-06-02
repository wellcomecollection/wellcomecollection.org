// @flow
export type Tweet = {|
  id: string;
  screenName: string;
  createdAt: Date;
  html: string;
|}

export function createTweet(data: Tweet) { return (data: Tweet); }
