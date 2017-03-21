export const name = 'chapter indicator';
export const handle = 'chapter-indicator';
export const display = {background: '#1d1d1d'};
export const variants = [
  {
    name: 'default',
    label: 'Purple',
    context: {model: {position: 2, series: {items: ['one', 'two', 'three'], total: 5, color: 'purple'}}}
  },
  {
    name: 'red',
    context: {model: {position: 2, series: {items: ['one', 'two', 'three'], total: 5, color: 'red'}}}
  },
  {
    name: 'orange',
    context: {model: {position: 2, series: {items: ['one', 'two', 'three'], total: 5, color: 'orange'}}}
  },
  {
    name: 'turquoise',
    context: {model: {position: 2, series: {items: ['one', 'two', 'three'], total: 5, color: 'turquoise'}}}
  },
  {
    name: 'half',
    context: {model: {position: 2, series: {items: ['one', 'two', 'three'], total: 5, color: 'purple'}}, modifiers: {'half': true}}
  },
  {
    name: 'full',
    context: {model: {position: 2, series: {items: ['one', 'two', 'three'], total: 5, color: 'purple'}}, modifiers: {'full': true}}
  }
];
