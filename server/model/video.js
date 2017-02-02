export type Video = {|
  name?: string;
  description?: string;
  embedUrl: string;
|}
export function video(data: Video) { return (data: Video); }

