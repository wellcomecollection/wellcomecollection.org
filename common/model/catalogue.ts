export type IdentifierType = {
  id: string;
  label: string;
  type: 'IdentifierType';
};

export type Identifier = {
  value: string;
  identifierType: IdentifierType;
  type: 'Identifier';
};

type AgentType = 'Agent' | 'Person' | 'Organisation' | 'Meeting';

export type Agent = {
  id?: string;
  identifiers?: Identifier[];
  label: string;
  standardLabel: string;
  type: AgentType;
};

type ContributorRole = {
  label: string;
  type: 'ContributionRole';
};

export type Contributor = {
  agent: Agent;
  roles: ContributorRole[];
  type: 'Contributor';
  primary: boolean;
};

export type DigitalLocation = {
  title?: string;
  linkText?: string;
  locationType: LocationType;
  url: string;
  credit?: string;
  license: License;
  accessConditions: AccessCondition[];
  type: 'DigitalLocation';
};

export function isDigitalLocation(
  location: Location
): location is DigitalLocation {
  return location.type === 'DigitalLocation';
}

export type PhysicalLocation = {
  locationType: LocationType;
  label: string;
  shelfmark?: string;
  accessConditions: AccessCondition[];
  type: 'PhysicalLocation';
};

export type Location = DigitalLocation | PhysicalLocation;

type LocationType = {
  id: string;
  label: string;
  type: 'LocationType';
};

export type License = {
  id: string;
  label: string;
  url: string;
  type: 'License';
};

export type AccessCondition = {
  status?: AccessStatus;
  terms?: string;
  to?: string;
  type: 'AccessCondition';
  method?: AccessMethod;
  note?: string;
};

type AccessMethod = {
  id: string;
  label: string;
  type: 'AccessMethod';
};

type AccessStatus = {
  id: string;
  label: string;
  type: 'AccessStatus';
};
