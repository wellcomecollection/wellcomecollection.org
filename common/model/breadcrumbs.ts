export type Breadcrumbs = {
  text: string;
  url?: string;
  prefix?: string;
  isHidden?: boolean;
}[];

export type BreadcrumbItems = {
  items: Breadcrumbs;
  noHomeLink?: boolean;
};
