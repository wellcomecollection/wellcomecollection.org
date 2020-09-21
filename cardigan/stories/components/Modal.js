import { storiesOf } from '@storybook/react';
import Modal from '../../../common/views/components/Modal/Modal';
import Readme from '../../../common/views/components/Modal/README.md';
import { useState } from 'react';
import ButtonSolid from '../../../common/views/components/ButtonSolid/ButtonSolid';

const ModalExample = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div style={{ padding: '50px' }}>
      <ButtonSolid text={'Show modal'} clickHandler={() => setIsActive(true)} />
      <Modal isActive={isActive} setIsActive={setIsActive}>
        <p>This is a modal window.</p>
      </Modal>
    </div>
  );
};

const stories = storiesOf('Components', module);
stories.add('Modal', ModalExample, {
  readme: { sidebar: Readme },
  isFullScreen: true,
});
