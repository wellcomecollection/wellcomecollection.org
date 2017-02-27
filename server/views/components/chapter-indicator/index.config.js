export const name = 'chapter indicator';
export const handle = 'chapter-indicator';
export const variants = [
  {
    name: 'default',
    label: 'Purple',
    context: {model: {number: 3, total: 5, color: 'purple'}}
  },
  {
    name: 'red',
    context: {model: {number: 3, total: 5, color: 'red'}}
  },
  {
    name: 'orange',
    context: {model: {number: 3, total: 5, color: 'orange'}}
  },
  {
    name: 'turquoise',
    context: {model: {number: 3, total: 5, color: 'turquoise'}}
  },
  {
    name: 'large',
    context: {model: {number: 3, total: 5, color: 'purple'}, modifiers: ['large']}
  }
];
