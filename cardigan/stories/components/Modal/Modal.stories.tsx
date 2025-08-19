import { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';

import Button from '@weco/common/views/components/Buttons';
import Modal from '@weco/common/views/components/Modal';

const Template = args => {
  const [isActive, setIsActive] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isActive && openButtonRef.current) {
      openButtonRef.current.click();
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      setIsActive(false);

      setTimeout(() => {
        if (openButtonRef.current) {
          openButtonRef.current.click();
        }
      }, 200);
    }
  }, [args.maxWidth]);

  return (
    <div style={{ padding: '50px' }}>
      <Button
        variant="ButtonSolid"
        ref={openButtonRef}
        text="Show modal"
        clickHandler={() => setIsActive(true)}
      />
      <Modal
        {...args}
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
  args: {
    id: 'test',
    showOverlay: true,
  },
  argTypes: {
    maxWidth: { control: 'radio', options: ['80%', '250px', undefined] },
    children: { table: { disable: true } },
    isActive: { table: { disable: true } },
    dataTestId: { table: { disable: true } },
    id: { table: { disable: true } },
    modalStyle: { table: { disable: true } },
    openButtonRef: { table: { disable: true } },
    removeCloseButton: { table: { disable: true } },
    setIsActive: { table: { disable: true } },
    width: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Basic: Story = {
  name: 'Modal',
  render: args => {
    return <Template {...args} />;
  },
};
