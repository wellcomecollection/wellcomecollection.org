export type WorkBasic = {
  id: string;
  title: string;
  reference: string | undefined;
  productionDates: string[];
  thumbnailUrl: string | undefined;
  partOf: string | undefined;
  workType: { label: string };
  availabilities: { id: string }[];
  primaryContributors: { label: string }[];
};
