// @flow
import createContributedThing from '../interfaces/ContributedThing';
import link from '../parts/link';
import singleLineText from '../parts/single-line-text';

const Story = createContributedThing('stories', {
  outroResearchItem: link('Outro: Research item'),
  outroResearchLinkText: singleLineText('Outro: Research link text'),
  outroReadItem: link('Outro: Read item'),
  outroReadLinkText: singleLineText('Outro: Read link text'),
  outroVisitItem: link('Outro: Visit item'),
  outroVisitLinkText: singleLineText('Outro: Visit link text'),
});

export default Story;
