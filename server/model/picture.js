// @flow
export type picture = {|
  contentUrl: string;
  width: number;
  height: number;
  fileType?: string;
  caption?: string;
  author?: string;
  copyrightHolder?: string;
  fileFormat?: string;
  url?: string;
|}

export function Picture(data: picture): picture {
  return (data: picture);
}
