// this is the shape we're moving to
// const work = {
//   id: '{workId}',
//   items: [
//     {
//       id: '{itemId}',
//       dueDate: '{dueDate}',
//       status: {
//         id: '-',
//         label: 'Available',
//         type: 'ItemStatus',
//       },
//       type: 'Item',
//     },
//     {
//       id: '{itemId}',
//       dueDate: '{dueDate}',
//       status: {
//         id: 'b',
//         label: 'As above',
//         type: 'ItemStatus',
//       },
//       type: 'Item',
//     },
//   ],
//   type: 'Work',
// };

// this is the current shape
// TODO switch to real shape - get real possible values
const work = {
  availableWork: {
    id: 'h6tcdtrt',
    items: [
      {
        id: 'sbumwwzs',
        location: { id: 'sgpbi', label: 'Closed stores Biog. pam' },
        status: { id: 'available', label: 'Available' },
      },
    ],
  },
  unavailableWork: {
    id: 'h6tcdtrt',
    items: [
      {
        id: 'sbumwwzs',
        location: { id: 'sgpbi', label: 'Closed stores Biog. pam' },
        status: { id: 'unavailable', label: 'Unavailable' },
      },
    ],
  },
  unrequestableWork: {
    id: 'h6tcdtrt',
    items: [
      {
        id: 'sbumwwzs',
        location: { id: 'sgpbi', label: 'Open shelves' },
        status: { id: 'unrequestable', label: 'Unrequestable' },
      },
    ],
  },
};

export default work;
