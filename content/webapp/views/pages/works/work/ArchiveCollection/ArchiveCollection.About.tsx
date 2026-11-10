import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { typography } from '@weco/common/utils/classnames';
import Divider from '@weco/common/views/components/Divider';
import {
  Grid,
  GridCell,
  SizeMap,
} from '@weco/common/views/components/styled/Grid';
import { Work as WorkType } from '@weco/content/services/wellcome/catalogue/types';
import { getOrderedNotes } from '@weco/content/utils/works';
import ArchiveCategoryLink from '@weco/content/views/components/ArchiveCategoryLink';
import CopyButtons from '@weco/content/views/components/CopyButtons';
import WorkDetailsList from '@weco/content/views/pages/works/work/WorkDetails/WorkDetails.List';
import WorkDetailsSection from '@weco/content/views/pages/works/work/WorkDetails/WorkDetails.Section';
import WorkDetailsText from '@weco/content/views/pages/works/work/WorkDetails/WorkDetails.Text';

const mainSizeMap: SizeMap = { s: [12], m: [12], l: [8], xl: [8] };
const sideSizeMap: SizeMap = { s: [12], m: [12], l: [4], xl: [4] };

const SideColumn = styled(GridCell)`
  ${props =>
    props.theme.media('md')(`
      height: calc(100% - ${props.theme.spacingUnits['600']});
      border-left: 1px solid ${props.theme.color('neutral.400')};
      padding-left: ${props.theme.gutter.large};
    `)}
`;

const ArchiveCollectionAbout: FunctionComponent<{
  work: WorkType;
  archiveCategorySlug?: string;
}> = ({ work, archiveCategorySlug }) => {
  const { orderedNotes, remainingNotes } = getOrderedNotes(work);
  const archiveCategory = work.archive?.category;

  const accessionNumberIdentifiers = work.identifiers.filter(
    id => id.identifierType.id === 'wellcome-accession-number'
  );

  return (
    <>
      <Grid>
        <GridCell $sizeMap={mainSizeMap}>
          <WorkDetailsSection headingText="About this work">
            {work.description && (
              <WorkDetailsText
                title="Description"
                html={work.description}
                allowDangerousRawHtml
              />
            )}

            {orderedNotes.map(note => (
              <WorkDetailsText
                key={note.noteType.label}
                title={note.noteType.label}
                html={note.contents}
                allowDangerousRawHtml
              />
            ))}

            {remainingNotes.map(note => (
              <WorkDetailsText
                key={note.noteType.label}
                title={note.noteType.label}
                html={note.contents}
                allowDangerousRawHtml
              />
            ))}
          </WorkDetailsSection>
        </GridCell>

        <SideColumn $sizeMap={sideSizeMap}>
          {archiveCategory && (
            <WorkDetailsText
              title="Type"
              contents={
                // No slug means there's no category page to link to (archive
                // browsing is off, or the category is left out of browsing)
                archiveCategorySlug ? (
                  <ArchiveCategoryLink slug={archiveCategorySlug}>
                    {archiveCategory.label}
                  </ArchiveCategoryLink>
                ) : (
                  <span>{archiveCategory.label}</span>
                )
              }
            />
          )}

          {work.physicalDescription && (
            <WorkDetailsText
              title="Physical description"
              html={work.physicalDescription}
              allowDangerousRawHtml
            />
          )}

          {accessionNumberIdentifiers.length > 0 && (
            <WorkDetailsList
              title="Accession numbers"
              list={accessionNumberIdentifiers.map(id => id.value)}
            />
          )}
        </SideColumn>
      </Grid>

      <Divider />

      <WorkDetailsSection headingText="Permanent link">
        <div className={typography('body', 'md', 'regular')}>
          <CopyButtons
            variant="url"
            url={`https://wellcomecollection.org/works/${work.id}`}
          />
        </div>
      </WorkDetailsSection>
    </>
  );
};

export default ArchiveCollectionAbout;
