// @flow
import {type Picture} from './picture';
export type Video = {|
  type: 'video';
  embedUrl: string;
  name?: string;
  description?: string;
  posterImage?: ?Picture;
|}
export function createVideo(data: Video) { return (data: Video); }

