import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';

const RecommendedSection = styled(Space).attrs({
  $v: { size: 'l', properties: ['margin-bottom', 'margin-top'] },
})`
  background-color: ${props => props.theme.color('white')};
`;

const RecommendedWrapper = styled.div`
  h2 {
    padding: 16px 24px;
    margin: 0;
  }

  ${props => props.theme.media('xlarge', 'min-width')`
    max-width: 2200px;
    margin: 0 auto;
    justify-content: center;
  `}
`;

const StoryPromoContainer = styled(Container)`
  padding: 0 24px ${props => props.theme.containerPadding.small}px;
  max-width: none;
  width: auto;
  overflow: auto;
  margin: 0 auto;
  margin-bottom: ${props => props.theme.containerPadding.medium}px;

  ${props =>
    props.theme.media(
      'medium',
      'max-width'
    )(`
    margin-bottom: ${props.theme.containerPadding.small}px;
  `)}

  &::-webkit-scrollbar {
    height: 18px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 0;
    border-style: solid;
    border-width: 0 ${props => props.theme.containerPadding.small}px 12px;
    background: ${props => props.theme.color('neutral.300')};
    border-color: ${props => props.theme.color('white')};
  }

  -webkit-overflow-scrolling: touch;
`;

const StoriesContainer = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  flex-basis: 30%;
  max-width: 30%;

  margin-left: 0;
  display: flex;
  flex-wrap: nowrap;

  ${props => props.theme.media('xlarge', 'min-width')`
    max-width: 2200px;
    margin: 0 auto;
  `}
`;

const StoryLink = styled.a`
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const StoryWrapper = styled.li`
  flex: 1;
  min-width: 33vw;
  max-width: 345px;
  padding-left: 0;
  padding-right: ${props => props.theme.gutter.small}px;
  text-decoration: none;

  &:last-child {
    padding-bottom: 0;
  }

  ${props => props.theme.media('xlarge', 'min-width')`
    min-width: 345px;
  `}

  ${props => props.theme.media('large', 'max-width')`
    min-width: 40vw;
  `}

  ${props => props.theme.media('medium', 'max-width')`
      max-width: 300px;
      min-width: 80vw;
  `}
`;

const Story = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.color('warmNeutral.300')};
  border-radius: 6px;
  overflow: hidden;

  img {
    max-width: 96px;
    max-height: 96px;
    margin-right: 8px;
  }

  h4 {
    margin: 0 8px 0 0;
  }
`;

type RecStories = {
  title: string;
  path: string;
  imageUrl: string;
};

const storiesArray: RecStories[] = [
  {
    title: 'Finding Audrey Amiss',
    path: '/series/finding-audrey-amiss',
    imageUrl:
      'https://images.prismic.io/wellcomecollection/ff095f17-11fc-4ec7-af22-6ed73dd75fb1_4k-sRGB_pp_ami_d_145_b32878229_0014.jpg?auto=compress,format&rect=755,0,1362,1362&w=200&h=200',
  },
  {
    title: 'Medieval mobility aids',
    path: '/stories/medieval-mobility-aids',
    imageUrl:
      'https://images.prismic.io/wellcomecollection/e86c3ba9-9bc6-4217-a72d-95d12244b5b1_EP001691_0001.jpg?auto=compress,format&rect=0,0,1994,1994&w=200&h=200',
  },
  {
    title: '‘My Hair Is Not…’',
    path: '/stories/-my-hair-is-not--',
    imageUrl:
      'https://images.prismic.io/wellcomecollection/bba64522-b65a-4c7e-8878-a8e8b5b51271_Headline.jpg?auto=compress,format&rect=827,0,2125,2125&w=200&h=200',
  },
  {
    title: 'A brief history of tattoos',
    path: '/stories/a-brief-history-of-tattoos',
    imageUrl:
      'https://images.prismic.io/wellcomecollection%2Fca88bb42-adf1-40fa-bfd3-dc3d4e87a53d_te+manawa_+an+arawa+warrior.+watercolour+by+h.g.+robley+crop+169.png?auto=format%2Ccompress&rect=166%2C0%2C458%2C458&w=200&h=200',
  },
  {
    title: '‘Yes I am’ – voices of autistic women from minoritised communities',
    path: '/stories/yes-i-am--voices-of-autistic-women-from-minoritised-communities',
    imageUrl:
      'https://images.prismic.io/wellcomecollection/ZxKdYIF3NbkBXugW_YesIAm-1.jpg?auto=format%2Ccompress&rect=99%2C93%2C3308%2C3308&w=200&h=200',
  },
  {
    title: 'The breastmilk market',
    path: '/series/the-breastmilk-market',
    imageUrl:
      'https://images.prismic.io/wellcomecollection/bf81194b-372e-4803-aeb5-ea4e8797725c_SDP_230511_VIckyScott_0001.jpg?auto=compress,format&rect=820,0,2250,2250&w=200&h=200',
  },
];

const getStories = (currentPath: string) => {
  // Removes story if on said story page
  const filteredStories = storiesArray.filter(
    story => story.path !== currentPath
  );

  // Randomiser taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  for (let i = filteredStories.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredStories[i], filteredStories[j]] = [
      filteredStories[j],
      filteredStories[i],
    ];
  }

  return filteredStories;
};

const RecommendedStories = () => {
  const [stories, setStories] = useState<RecStories[]>();

  useEffect(() => {
    if (!stories) {
      setStories(getStories(window.location.pathname));
    }
  }, []);

  if (!stories) return null;

  return (
    <RecommendedSection>
      <WobblyEdge backgroundColor="warmNeutral.300" isRotated />

      <RecommendedWrapper>
        <h2 className={font('wb', 3)}>Popular stories</h2>

        <StoryPromoContainer>
          <StoriesContainer>
            {stories.map(story => {
              return (
                <StoryWrapper key={story.title}>
                  <StoryLink href={story.path}>
                    <Story>
                      <img src={story.imageUrl} alt={story.title} />
                      <h4 className={font('wb', 6)}>{story.title}</h4>
                    </Story>
                  </StoryLink>
                </StoryWrapper>
              );
            })}
          </StoriesContainer>
        </StoryPromoContainer>
      </RecommendedWrapper>
    </RecommendedSection>
  );
};

export default RecommendedStories;
