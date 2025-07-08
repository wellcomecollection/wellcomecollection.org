import { ChoiceBody, ContentResource, Range } from '@iiif/presentation-3';

import { RelatedWork } from '@weco/content/services/wellcome/catalogue/types';
import {
  CustomContentResource,
  TransformedCanvas,
} from '@weco/content/types/manifest';

export type CanvasWork = TransformedCanvas & {
  title: string;
  totalParts: number;
  downloads: (ContentResource | CustomContentResource | ChoiceBody)[];
};

export type RangeWork = Range & {
  title: string;
  totalParts: number;
};

export type UiTreeNode = {
  openStatus: boolean;
  parentId?: string;
  children?: UiTree;
  work: RelatedWork | CanvasWork | RangeWork;
};

export type UiTree = UiTreeNode[];
