import { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';

import Button from '@weco/common/views/components/Buttons';
import Modal from '@weco/common/views/components/Modal';

const Template = () => {
  const [isActive, setIsActive] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isActive && openButtonRef.current) {
      openButtonRef.current.click();
    }
  }, []);

  return (
    <div style={{ padding: '50px' }}>
      <Button
        variant="ButtonSolid"
        ref={openButtonRef}
        text="Show modal"
        clickHandler={() => setIsActive(true)}
      />
      <Modal
        id="test"
        openButtonRef={openButtonRef}
        isActive={isActive}
        setIsActive={setIsActive}
      >
        <p>This is a modal window.</p>
      </Modal>
    </div>
  );
};

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    chromatic: {
      delay: 500, // Allow the button to get clicked
    },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Basic: Story = {
  name: 'Modal',
  render: Template,
};
