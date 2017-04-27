// @flow
export type Picture = {|
  type: 'picture';
  contentUrl: string;
  width: number;
  height: number;
  fileType?: string;
  caption?: ?string;
  alt?: ?string;
  copyright?: ?string;
  author?: string;
  copyrightHolder?: string;
  fileFormat?: string;
  isMain?: boolean;
  url?: ?string;
|}

export function createPicture(data: Picture): Picture {
  return (data: Picture);
}
