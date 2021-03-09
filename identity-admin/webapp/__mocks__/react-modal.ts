import ReactModal from 'react-modal';

const oldFn = ReactModal.setAppElement;

ReactModal.setAppElement = element => {
  if (element === '#__next') {
    // otherwise it will throw aria warnings.
    return oldFn(document.createElement('div'));
  }
  oldFn(element);
};

export default ReactModal;
