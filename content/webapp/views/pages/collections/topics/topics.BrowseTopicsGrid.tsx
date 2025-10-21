import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import { BrowseTopic, randomTopicPool } from '@weco/content/data/browse/topics';

import BrowseTopicCard from './topics.BrowseTopicCard';
import SurpriseMeCard from './topics.SurpriseMeCard';

type Props = {
  topics: BrowseTopic[];
};

const BrowseTopicsGrid: FunctionComponent<Props> = ({ topics }) => {
  const [surpriseTopic, setSurpriseTopic] = useState<string | null>(null);

  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * randomTopicPool.length);
    setSurpriseTopic(randomTopicPool[randomIndex]);
  };

  return (
    <Grid>
      {topics.map(topic => (
        <GridCell key={topic.id} $sizeMap={{ s: [12], m: [6], l: [4], xl: [4] }}>
          <BrowseTopicCard topic={topic} />
        </GridCell>
      ))}
      <GridCell $sizeMap={{ s: [12], m: [6], l: [4], xl: [4] }}>
        <SurpriseMeCard
          currentTopic={surpriseTopic}
          onSurpriseMe={handleSurpriseMe}
        />
      </GridCell>
    </Grid>
  );
};

export default BrowseTopicsGrid;
