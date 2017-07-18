export const name = 'button-link';
export const handle = 'button-link';
export const status = 'graduated';
export const collated = true;
export const context = {
  href: 'wellcomecollection.org',
  text: 'this is a button'
};

export const variants = [{
  name: 'with-icon',
  context: {
    icon: 'actions/download-1',
    iconExtraClasses: ['icon--fill', 'icon--2x'],
    text: 'this is a link with an icon'
  }
}, {
  name: 'light-button',
  context: {
    modifierClasses: 'btn--light',
    text: 'this is a link'
  }
}, {
  name: 'dark-button-with-icon',
  display: {
    background: '#000'
  },
  context: {
    modifierClasses: 'btn--dark',
    icon: 'actions/download-1',
    iconExtraClasses: ['icon--fill', 'icon--2x'],
    text: 'this is a link'
  }
}];
