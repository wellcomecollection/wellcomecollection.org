import { Project } from '@weco/content/types/projects';
import {
  transformFormat,
  transformGenericFields,
  transformSingleLevelGroup,
} from '.';
import { transformSeason } from './seasons';
import {
  SeasonsDocument as RawSeasonsDocument,
  ProjectsDocument as RawProjectsDocument,
} from '@weco/common/prismicio-types';
import { SiteSection } from '@weco/common/views/components/PageLayout/PageLayout';
import { links as headerLinks } from '@weco/common/views/components/Header/Header';
import { transformContributors } from './contributors';

export function transformProject(document: RawProjectsDocument): Project {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  const seasons = transformSingleLevelGroup(data.seasons, 'season').map(
    season => {
      return transformSeason(season as RawSeasonsDocument);
    }
  );

  // TODO (tagging): This is just for now, we will be implementing a proper site tagging
  // strategy for this later
  const siteSections = headerLinks.map(link => link.siteSection);
  const siteSection = document.tags.find(tag =>
    siteSections.includes(tag as SiteSection)
  ) as SiteSection;

  const promo = genericFields.promo;

  const contributors = transformContributors(document);

  return {
    type: 'projects',
    uid: document.uid,
    ...genericFields,
    format: transformFormat(document),
    seasons,
    promo: promo && promo.image ? promo : undefined,
    contributors,
    siteSection,
  };
}
