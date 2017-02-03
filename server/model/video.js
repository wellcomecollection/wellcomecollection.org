export type Video = {|
  name?: string;
  description?: string;
  embedUrl: string;
|}
export function createVideo(data: Video) { return (data: Video); }

