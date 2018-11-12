// @flow
// import type {Link} from './link';

export type MetaUnitProps = {|
  headingLevel?: number;
  headingText: string;
  links?: any[]; // TODO replace with React.Element<'NextLink'>[], once moved to V2
  text?: string[];
  list?: string[];
  includeDivider?: boolean;
|};

export function createMetaUnit(data: MetaUnitProps) { return (data: MetaUnitProps); }
