// TODO delete file

import { Label } from '@weco/common/model/labels';

export type ContentAPILinkedWork = {
  id: string;
  title: string;
  type: 'Work';
  thumbnailUrl: string;
  date: string;
  mainContributor: string;
  labels: Label[];
};
