// @flow

export type Work = {|
  id: string;
  label: string;
  description: string;
  createdDate: {
    label: string,
    type: string
  };
  creators: Array<string>;
  type: string;
  identifiers?: ?Array<{
    source: string,
    name: string,
    value: string,
    type: string
  }>;
|};

