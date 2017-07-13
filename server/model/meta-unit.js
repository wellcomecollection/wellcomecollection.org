// @flow
import type {Link} from './link';
import type {Time} from './time';

export type MetaUnit = {|
  headingLevel?: number;
  headingText: string;
  content: Array<Link> | Array<Time> | string;
  includeDivider?: boolean;
|};

export function createMetaUnit(data: MetaUnit) { return (data: MetaUnit); }
