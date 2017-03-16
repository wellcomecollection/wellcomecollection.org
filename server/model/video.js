// @flow
export type Video = {|
  type: 'video';
  name?: string;
  description?: string;
  embedUrl: string;
|}
export function createVideo(data: Video) { return (data: Video); }

