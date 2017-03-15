// @flow
export type Picture = {|
  type: 'picture';
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

export function createPicture(data: Picture): Picture {
  return (data: Picture);
}
