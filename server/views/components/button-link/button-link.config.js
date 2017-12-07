export const name = 'button-link';
export const handle = 'button-link';
export const status = 'graduated';
export const collated = false;
export const context = {
  href: 'wellcomecollection.org',
  text: 'this is a button'
};

export const variants = [{
  name: 'with-icon',
  context: {
    icon: 'download',
    text: 'this is a link with an icon'
  }
}, {
  name: 'light-button',
  context: {
    modifierClasses: 'btn--light',
    text: 'this is a link'
  }
}, {
  name: 'transparent-button',
  context: {
    modifierClasses: 'btn--transparent-black',
    text: 'this is a link'
  }
}, {
  name: 'button-for-dark-bg-with-icon',
  display: {
    background: '#000'
  },
  context: {
    modifierClasses: 'btn--dark',
    icon: 'download',
    text: 'this is a link'
  }
}];
