// @flow
import type {Picture} from './picture';
export type VideoEmbed = {|
  type: 'video-embed';
  embedUrl: string;
  name?: string;
  description?: string;
  posterImage?: ?Picture;
|}
export function createVideoEmbed(data: VideoEmbed) { return (data: VideoEmbed); }
