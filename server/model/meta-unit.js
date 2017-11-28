// @flow
import type {Link} from './link';

export type MetaUnit = {|
  headingLevel?: number;
  headingText: string;
  content: Array<Link> | Array<string> | string;
  includeDivider?: boolean;
|};

export function createMetaUnit(data: MetaUnit) { return (data: MetaUnit); }
