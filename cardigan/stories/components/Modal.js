import { storiesOf } from '@storybook/react';
import Modal from '../../../common/views/components/Modal/Modal';
import Readme from '../../../common/views/components/Modal/README.md';
import { useState } from 'react';

const ModalExample = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div style={{ padding: '50px' }}>
      <button className="btn btn--primary" onClick={() => setIsActive(true)}>
        show modal
      </button>
      <Modal isActive={isActive} setIsActive={setIsActive}>
        yoyoyo
      </Modal>
    </div>
  );
};

const stories = storiesOf('Components', module);
stories.add('Modal', ModalExample, {
  readme: { sidebar: Readme },
  isFullScreen: true,
});
