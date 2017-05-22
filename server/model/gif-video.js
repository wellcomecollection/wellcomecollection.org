// @flow
import type { Picture } from './picture';
import type { VideoSource } from './video-source';
export type GifVideo = {|
  sources: Array<VideoSource>;
  caption?: string;
  posterImage: Picture;
|}

export function createGifVideo(data: GifVideo) { return (data: GifVideo); }

