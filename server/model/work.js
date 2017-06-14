// @flow

export type Work = {|
  id: string;
  label: string;
  descripition: string;
  createdDate: {
    label: string,
    type: string
  };
  creators: Array<string>;
  type: string;
|};

