import { Identifier, PhysicalLocation } from './catalogue';

type PickupLocation = {
  id: string;
  label: string;
  type: 'LocationDescription';
};

type RequestStatus = {
  id: string;
  label: string;
  type: 'RequestStatus';
};

type RequestItem = {
  item: {
    id: string;
    identifiers?: Identifier[];
    title?: string;
    locations: PhysicalLocation[];
    type: 'Item';
  };
  pickupLocation: PickupLocation;
  status: RequestStatus;
  type: 'Request';
};

export type RequestsList = {
  results: RequestItem[];
  type: 'ResultList';
  totalResults: number;
};
