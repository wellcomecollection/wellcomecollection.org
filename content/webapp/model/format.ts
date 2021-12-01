export type Format<IdType extends string = string> = {
  id: IdType;
  title: string;
  description?: string;
};
