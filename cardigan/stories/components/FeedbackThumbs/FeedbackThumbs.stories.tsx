import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import styled, { useTheme } from 'styled-components';
import { font } from '@weco/common/utils/classnames';

export type FeedbackThumbsProps = {
  gaCategory?: string;
  gaLabel?: string;
  question?: string;
  reportMailto?: string;
};

export const FeedbackThumbs: React.FC<FeedbackThumbsProps> = ({
  gaCategory = 'Feedback',
  gaLabel = 'Footer',
  question = 'Is this page useful to you?',
  reportMailto = 'mailto:info@example.com',
}) => {
  const [selected, setSelected] = useState<'up' | 'down' | null>(null);
  const theme = useTheme();

  const sendGAEvent = (action: 'ThumbsUp' | 'ThumbsDown') => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: gaCategory,
        event_label: gaLabel,
      });
    }
  };

  const handleThumb = (type: 'up' | 'down') => {
    setSelected(type);
    sendGAEvent(type === 'up' ? 'ThumbsUp' : 'ThumbsDown');
  };

  // Use palette colors
  const neutralBg = theme.color('warmNeutral.300');
  const borderColor = theme.color('neutral.300');
  const thumbColor = theme.color('neutral.500');
  const textColor = theme.color('black');

  // SVGs are 24x24, paths centered in viewbox, fill uses currentColor
  const ThumbUpSVG = ({ filled }: { filled: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.5 2c-1.2 0-1.6 1.1-1.9 2.1C6.1 8.1 4 8.5 2 8.8V18c2.5 0 4 0.5 5.7 1.2C8.9 19.6 10.2 20 12 20c2.1 0 3.3-0.7 3.8-2.6C16.3 15.2 17 11.1 17 10.3c0-1.3-1-2-2.1-2.1-0.9-0.1-2.1-0.2-2.8-0.5C12.6 5.1 13 2 9.5 2Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="black"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );

  const ThumbDownSVG = ({ filled }: { filled: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.5 22c1.2 0 1.6-1.1 1.9-2.1C17.9 15.9 20 15.5 22 15.2V6c-2.5 0-4-0.5-5.7-1.2C15.1 4.4 13.8 4 12 4c-2.1 0-3.3 0.7-3.8 2.6C7.7 8.8 7 12.9 7 13.7c0 1.3 1 2 2.1 2.1 0.9 0.1 2.1 0.2 2.8 0.5C11.4 18.9 11 22 14.5 22Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="black"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <FeedbackThumbsContainer $bg={neutralBg} $border={borderColor}>
      <ThumbsRow>
        <QuestionText className={font('intm', 8)} $color={textColor}>
          {question}
        </QuestionText>
        <ThumbButton
          aria-label="Thumbs up"
          onClick={() => handleThumb('up')}
          disabled={!!selected}
          data-testid="thumbs-up"
          $thumbColor={thumbColor}
        >
          <ThumbUpSVG filled={selected === 'up'} />
        </ThumbButton>
        <ThumbButton
          aria-label="Thumbs down"
          onClick={() => handleThumb('down')}
          disabled={!!selected}
          data-testid="thumbs-down"
          $thumbColor={thumbColor}
        >
          <ThumbDownSVG filled={selected === 'down'} />
        </ThumbButton>
      </ThumbsRow>
      <ReportLink
        href={reportMailto}
        $color={textColor}
        className={font('intm', 8)}
      >
        Report a problem with this page
      </ReportLink>
    </FeedbackThumbsContainer>
  );
};

const FeedbackThumbsContainer = styled.div<{ $bg: string; $border: string }>`
  width: 100%;
  background: ${props => props.$bg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 40px;
  box-sizing: border-box;
  border-top: 1px solid ${props => props.$border};
  border-bottom: 1px solid ${props => props.$border};
`;

const ThumbsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuestionText = styled.span<{ $color: string }>`
  font-size: 1.15rem;
  color: ${props => props.$color};
  font-weight: 500;
  padding: 8px 8px 8px 0;
  line-height: 1.4;
`;
const ThumbButton = styled.button<{ $thumbColor: string }>`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  width: 40px;
  height: 40px;
  color: ${props => props.$thumbColor};

  svg {
    display: block;
    width: 36px;
    height: 36px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ReportLink = styled.a<{ $color: string }>`
  margin-left: auto;
  color: ${props => props.$color};
  text-decoration: underline;
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 0 8px 32px;
  align-self: flex-start;
`;


const meta: Meta<typeof FeedbackThumbs> = {
  title: 'Components/FeedbackThumbs',
  component: FeedbackThumbs,
};

export default meta;

type Story = StoryObj<typeof FeedbackThumbs>;