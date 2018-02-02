// @flow
import type {Link} from './link';

export type MetaUnitProps = {|
  headingLevel?: number;
  headingText: string;
  links?: Array<Link>;
  text?: Array<string>;
  includeDivider?: boolean;
|};

export function createMetaUnit(data: MetaUnitProps) { return (data: MetaUnitProps); }
