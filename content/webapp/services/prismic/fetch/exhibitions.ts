import { fetcher } from '.';
import { ExhibitionPrismicDocument } from '../types/exhibitions';

const fetchLinks = [];

const exhibitionsFetcher = fetcher<ExhibitionPrismicDocument>(
  'exhibitions',
  fetchLinks
);

export const fetchExhibition = exhibitionsFetcher.getById;
export const fetchExhibitions = exhibitionsFetcher.getByType;
export const fetchExhibitionsClientSide =
  exhibitionsFetcher.getByTypeClientSide;
