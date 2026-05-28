import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps, useEffect, useState } from 'react';
import styled from 'styled-components';

import InactivityRedirectModal from '@weco/common/views/components/InactivityRedirect/InactivityRedirect.Modal';

const ModalFrame = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  margin: 40px auto;
`;

type StoryProps = ComponentProps<typeof InactivityRedirectModal>;

const CountdownPreview = (args: StoryProps) => {
  const [countdown, setCountdown] = useState(args.warningCountdown);

  useEffect(() => {
    setCountdown(args.warningCountdown);
  }, [args.warningCountdown]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev <= 0 ? args.warningCountdown : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [args.warningCountdown]);

  return (
    <ModalFrame>
      <InactivityRedirectModal {...args} countdown={countdown} />
    </ModalFrame>
  );
};

const meta: Meta<StoryProps> = {
  title: 'Components/InactivityRedirect',
  component: InactivityRedirectModal,
  args: {
    warningCountdown: 30,
  },
  argTypes: {
    warningCountdown: {
      name: 'Warning countdown (seconds)',
      control: { type: 'number' },
    },
    countdown: { table: { disable: true } },
    onKeepBrowsing: { table: { disable: true } },
    onReset: { table: { disable: true } },
  },
  render: args => <CountdownPreview {...args} />,
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Default: Story = { name: 'InactivityRedirect' };
