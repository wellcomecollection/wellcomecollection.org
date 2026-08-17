import { ChoiceBody, ContentResource, Range } from '@iiif/presentation-3';

import { RelatedWork } from '@weco/content/services/wellcome/catalogue/types';
import {
  CustomContentResource,
  TransformedCanvas,
} from '@weco/content/types/manifest';

export type TreeDataWork = RelatedWork;

export type TreeDataCanvas = TransformedCanvas & {
  title: string;
  totalParts: number;
  downloads: (ContentResource | CustomContentResource | ChoiceBody)[];
};

export type TreeDataRange = Range & {
  title: string;
  totalParts: number;
};

export type UiTreeNode = {
  openStatus: boolean;
  parentId?: string;
  children?: UiTree;
  data: TreeDataWork | TreeDataCanvas | TreeDataRange;
  // Position among all visible rows in document order. Only set by trees
  // that need to alternate row backgrounds without relying on DOM
  // nth-child, which can't produce a continuous alternation across nested
  // <ul>s.
  rowIndex?: number;
};

export type UiTree = UiTreeNode[];
