// @flow
import heading from './heading';
import contributors from './contributors';

export default function() {
  return {
    contributors,
    contributorsTitle: heading('Contributors heading')
  };
}
