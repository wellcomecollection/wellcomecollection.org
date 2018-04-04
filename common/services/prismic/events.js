import {getDocument} from './api';
import {parseBackgroundTexture} from './parsers';
import type {UiEventSeries} from '../../model/events';

export async function getUiEventSeries(req: Request, id: string): Promise<UiEventSeries> {
  const series = await getDocument(req, id, {
    fetchLinks: ['background-textures.image', 'background-textures.name']
  });

  const prismicBackgroundTexture = series && series.data && series.data.backgroundTexture && series.data.backgroundTexture.data;

  return {
    id: id,
    title: series && series.data && series.data.title || 'TITLE MISSING',
    description: series && series.data && series.data.description,
    backgroundTexture: prismicBackgroundTexture ? parseBackgroundTexture(prismicBackgroundTexture) : null
  };
}
