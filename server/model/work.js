// @flow

export type Work = {|
  id: string;
  title: string;
  description: string;
  createdDate: {
    label: string,
    type: string
  };
  creators: Array<string>;
  type: string;
  identifiers?: ?Array<{
    identifierScheme: string,
    value: string,
    type: string
  }>;
|};
