import { FunctionComponent } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

const CardButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
  width: 100%;
  background-color: ${props => props.theme.color('accent.lightBlue')};
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  color: ${props => props.theme.color('black')};
  transition:
    transform 200ms ease,
    background-color 200ms ease;
  padding: ${props => props.theme.spacingUnit * 3}px;

  &:hover,
  &:focus {
    transform: translateY(-2px);
    background-color: ${props => props.theme.color('accent.blue')};
    color: ${props => props.theme.color('white')};
  }
`;

const Title = styled.h3.attrs({
  className: font('wb', 2),
})`
  margin: 0 0 ${props => props.theme.spacingUnit * 2}px 0;
  text-align: center;
`;

const TopicDisplay = styled.p.attrs({
  className: font('wb', 3),
})`
  margin: ${props => props.theme.spacingUnit * 2}px 0 0 0;
  text-align: center;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TopicLink = styled(Link).attrs({
  className: font('wb', 3),
})`
  margin: ${props => props.theme.spacingUnit * 2}px 0 0 0;
  text-align: center;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: inherit;
  
  &:hover,
  &:focus {
    text-decoration: underline;
  }
  
  ${CardButton}:hover &,
  ${CardButton}:focus & {
    color: ${props => props.theme.color('white')};
  }
`;

const Instructions = styled.p.attrs({
  className: font('intr', 5),
})`
  margin: 0;
  text-align: center;
  color: ${props => props.theme.color('neutral.700')};
  
  ${CardButton}:hover &,
  ${CardButton}:focus & {
    color: ${props => props.theme.color('white')};
  }
`;

type Props = {
  currentTopic: { label: string; id: string; } | null;
  onSurpriseMe: () => void;
};

const SurpriseMeCard: FunctionComponent<Props> = ({
  currentTopic,
  onSurpriseMe,
}) => {
  return (
    <CardButton
      onClick={onSurpriseMe}
      data-component="surprise-me-card"
      aria-label="Get a random topic suggestion"
    >
      <Title>Surprise me</Title>
      <Instructions>
        {currentTopic
          ? 'Click again for another topic'
          : 'Click to explore a random topic'}
      </Instructions>
      {currentTopic && (
        <TopicLink href={`/concepts/${currentTopic.id}`} onClick={(e) => e.stopPropagation()}>
          {currentTopic.label}
        </TopicLink>
      )}
    </CardButton>
  );
};

export default SurpriseMeCard;
