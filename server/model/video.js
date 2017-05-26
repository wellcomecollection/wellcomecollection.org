// @flow
import type { Picture } from './picture';
import type { VideoSource } from './video-source';
export type Video = {|
  sources: Array<VideoSource>;
  caption?: string;
  posterImage: Picture;
|}

export function createVideo(data: Video) { return (data: Video); }

