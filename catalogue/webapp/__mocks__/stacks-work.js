// this is the shape we're moving to
const work = {
  id: '{workId}',
  items: [
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: '!',
        label: 'On holdshelf',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: '$',
        label: 'Lost and paid',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: '%',
        label: 'ILL returned',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: '-',
        label: 'Available',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: '6',
        label: 'DUE TEMP6',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: '9',
        label: 'DUE 25-09-15',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 'b',
        label: 'As above',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 'c',
        label: 'As above',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 'd',
        label: 'On display',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 'e',
        label: 'On exhibition',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 'f',
        label: 'Returned to vendor',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 'h',
        label: 'Closed',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 'm',
        label: 'Missing',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 'n',
        label: 'Billed',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 'o',
        label: 'Library use only',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 'p',
        label: 'In cataloguing',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 'q',
        label: 'Test record',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 'r',
        label: 'Restricted',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 's',
        label: 'On search',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 't',
        label: 'In transit',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 'v',
        label: 'With Conservation',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 'w',
        label: 'Dept material',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 'x',
        label: 'Withdrawn',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 'y',
        label: 'Permission required',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
    {
      id: '{itemId}',
      dueDate: '{dueDate}',
      status: {
        id: 'z',
        label: 'Claims returned',
        type: 'ItemStatus',
      },
      type: 'Item',
    },
  ],
  type: 'Work',
};
// this is the current shape
// TODO switch to real shape - get real possible values
// const mockItems = {
//   available: {
//     id: 'h6tcdtrt',
//     items: [
//       {
//         id: 'sbumwwzs',
//         location: { id: 'sgpbi', label: 'Closed stores Biog. pam' },
//         status: { id: 'available', label: 'Available' },
//       },
//     ],
//   },
//   unavailable: {
//     id: 'h6tcdtrt',
//     items: [
//       {
//         id: 'sbumwwzs',
//         location: { id: 'sgpbi', label: 'Closed stores Biog. pam' },
//         status: { id: 'unavailable', label: 'Unavailable' },
//       },
//     ],
//   },
//   unrequestable: {
//     id: 'h6tcdtrt',
//     items: [
//       {
//         id: 'sbumwwzs',
//         location: { id: 'sgpbi', label: 'Open shelves' },
//         status: { id: 'unrequestable', label: 'Unrequestable' },
//       },
//     ],
//   },
// };

export default work;
