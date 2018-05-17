import PrimaryLink from '../common/views/components/Links/PrimaryLink/PrimaryLink';
import SecondaryLink from '../common/views/components/Links/SecondaryLink/SecondaryLink';

export default [{
  component: PrimaryLink,
  props: {
    url: '#thigns',
    name: 'Hi there'
  }
}, {
  component: SecondaryLink,
  props: {
    url: '#tings',
    text: 'Bye there'
  }
}];
