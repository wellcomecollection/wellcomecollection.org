const requests = {
  results: [
    {
      item: {
        id: 'xyz',
        type: 'Item',
      },
      pickupDate: '{date}',
      pickupLocation: {
        id: 'sepbb',
        label: 'Rare Materials Room',
        type: 'LocationDescription',
      },
      status: {
        id: 'i',
        label: 'Item hold ready for pickup.',
        type: 'RequestStatus',
      },
      type: 'Request',
    },
  ],
  totalResults: 1,
  type: 'ResultList',
};

export default requests;
