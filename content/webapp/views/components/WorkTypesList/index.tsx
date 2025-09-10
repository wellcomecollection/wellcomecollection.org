import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

import { WorkTypeStats } from '@weco/content/services/wellcome/catalogue/workTypeAggregations';

const StyledImage = styled(Image)`
  width: 80px;
  height: 80px;

  ${props =>
    props.theme.media('medium')(`
    width: 100%;
    height: auto;
    max-width: 120px;
  `)}
`;

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacingUnit * 3}px;
  align-items: stretch;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;

  ${props =>
    props.theme.media('medium')(`
    flex-direction: row;
    justify-content: space-between;
    gap: ${props.theme.spacingUnit * 2}px;
    min-width: 0;
  `)}
`;

const StyledListItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  gap: ${props => props.theme.spacingUnit * 2}px;
  flex: 1;

  ${props =>
    props.theme.media('medium')(`
    flex-direction: column;
    text-align: center;
    gap: 0;
    min-width: 0;
    flex: 1 1 0;
  `)}
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  max-width: 80px;
  margin-bottom: 0;
  flex-shrink: 0;

  ${props =>
    props.theme.media('medium')(`
    min-height: 120px;
    max-width: 100%;
    margin-bottom: ${props.theme.spacingUnit}px;
    flex-shrink: 1;
  `)}
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 1;

  ${props =>
    props.theme.media('medium')(`
    align-items: center;
  `)}
`;

type WorkTypeItemProps = {
  icon: React.ReactNode;
  stats: WorkTypeStats;
  loading: boolean;
};

const WorkTypeItem: React.FC<WorkTypeItemProps> = ({
  icon,
  stats,
  loading,
}) => (
  <StyledListItem data-component="work-type-item">
    <IconContainer>{icon}</IconContainer>
    <TextContainer>
      {(loading || stats.count !== null) && (
        <div>
          <strong>
            {loading
              ? '...'
              : stats.count === 120000
                ? '120,000+'
                : stats.count!.toLocaleString()}
          </strong>
        </div>
      )}
      <div>{stats.label}</div>
    </TextContainer>
  </StyledListItem>
);

// SVG Icon Components
const BookIcon = () => (
  <StyledImage
    src="/icons/book.svg"
    alt="Books and Journals"
    width={120}
    height={120}
  />
);

const ImageIcon = () => (
  <StyledImage src="/icons/image.svg" alt="Images" width={120} height={120} />
);

const ArchivesIcon = () => (
  <StyledImage
    src="/icons/archives.svg"
    alt="Archives and Manuscripts"
    width={120}
    height={120}
  />
);

const VideoAudioIcon = () => (
  <StyledImage
    src="/icons/video-audio.svg"
    alt="Audio and Video"
    width={120}
    height={120}
  />
);

const EphemeraIcon = () => (
  <StyledImage
    src="/icons/ephemera.svg"
    alt="Ephemera"
    width={120}
    height={120}
  />
);

type WorkTypesListProps = {
  collectionStats: {
    booksAndJournals: WorkTypeStats;
    images: WorkTypeStats;
    archivesAndManuscripts: WorkTypeStats;
    audioAndVideo: WorkTypeStats;
    ephemera: WorkTypeStats;
  };
  loading: boolean;
};

const WorkTypesList: React.FC<WorkTypesListProps> = ({
  collectionStats,
  loading,
}) => (
  <div data-component="work-types-list">
    <StyledList>
      <WorkTypeItem
        icon={<BookIcon />}
        stats={collectionStats.booksAndJournals}
        loading={loading}
      />
      <WorkTypeItem
        icon={<ImageIcon />}
        stats={collectionStats.images}
        loading={loading}
      />
      <WorkTypeItem
        icon={<ArchivesIcon />}
        stats={collectionStats.archivesAndManuscripts}
        loading={loading}
      />
      <WorkTypeItem
        icon={<VideoAudioIcon />}
        stats={collectionStats.audioAndVideo}
        loading={loading}
      />
      <WorkTypeItem
        icon={<EphemeraIcon />}
        stats={collectionStats.ephemera}
        loading={loading}
      />
    </StyledList>
  </div>
);

export default WorkTypesList;
