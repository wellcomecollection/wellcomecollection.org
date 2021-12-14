import urlTemplate from 'url-template';

const prismicBaseUri = 'https://images.prismic.io/wellcomecollection';
const iiifImageUri = 'https://iiif.wellcomecollection.org/image/';

function determineSrc(url: string): string {
  if (url.startsWith(prismicBaseUri)) {
    return 'prismic';
  } else if (url.startsWith(iiifImageUri)) {
    return 'iiif';
  } else {
    return 'unknown';
  }
}

function determineIfGif(originalUriPath: string): boolean {
  return originalUriPath.includes('.gif');
}

function determineFinalFormat(originalUriPath: string): string {
  if (originalUriPath.includes('.png')) {
    return 'png';
  } else {
    return 'jpg';
  }
}

type PrismicUriOpts = {
  auto?: string;
  rect?: string;
  w?: number | 'full';
  h?: number;
};

function prismicImageTemplate(baseUrl: string) {
  const templateString = `${baseUrl}?auto={auto}&rect={rect}&w={w}&h={h}`;
  const template = urlTemplate.parse(templateString);
  return (opts: PrismicUriOpts) => {
    return template.expand(opts);
  };
}

export type IIIFUriProps = {
  region?: string;
  size?: string;
  rotation?: number;
  quality?: string;
  format?: string;
};

type IIIFImageTemplate = (opts: IIIFUriProps) => string;

export function iiifImageTemplate(infoJsonLocation: string): IIIFImageTemplate {
  const baseUrl = infoJsonLocation.replace('/info.json', '');
  const templateString = `${baseUrl}/{region}/{size}/{rotation}/{quality}.{format}`;
  const defaultOpts = {
    region: 'full',
    size: 'full',
    rotation: 0,
    quality: 'default',
    format: 'jpg',
  };
  const template = urlTemplate.parse(templateString);
  return (opts: IIIFUriProps) => template.expand({ ...defaultOpts, ...opts });
}

function paramsToObject(entries: IterableIterator<[string, string]>) {
  return Array.from(entries).reduce((acc, curr) => {
    const [key, value] = curr;
    acc[key] = value;
    return acc;
  }, {});
}

function prismicTemplateParts( // gets the params from the original Prismic image url so they can be manipulated
  originalUri: string,
  requiredSize: number | 'full'
) {
  const url = new URL(originalUri);
  const base = `${url.origin}${url.pathname}`;
  const urlParams = url.searchParams;
  const width = urlParams && urlParams.get('w');
  const height = urlParams && urlParams.get('h');
  const params =
    urlParams && typeof requiredSize === 'number' && width && height
      ? {
          ...paramsToObject(urlParams.entries()),
          w: requiredSize,
          h: Math.round((requiredSize / Number(width)) * Number(height)),
        }
      : {
          ...paramsToObject(urlParams.entries()),
          w: requiredSize,
        };
  return {
    base,
    params,
  };
}

export function convertIiifImageUri(
  originalUri: string,
  requiredSize: number | 'full'
): string {
  if (determineIfGif(originalUri) || !originalUri.startsWith(iiifImageUri)) {
    return originalUri;
  } else {
    const imageIdentifier = originalUri.split(iiifImageUri)[1].split('/', 2)[0];

    const params = {
      size: requiredSize === 'full' ? 'full' : `${requiredSize},`,
      format: determineFinalFormat(originalUri),
    };
    return iiifImageTemplate(`${iiifImageUri}${imageIdentifier}`)(params);
  }
}

export function convertImageUri(
  originalUri: string,
  requiredSize: number | 'full'
): string {
  const imageSrc = determineSrc(originalUri);
  if (imageSrc === 'prismic') {
    const parts = prismicTemplateParts(originalUri, requiredSize);
    return prismicImageTemplate(parts.base)({
      ...parts.params,
    });
  } else if (imageSrc === 'iiif') {
    return convertIiifImageUri(originalUri, requiredSize);
  } else {
    return originalUri;
  }
}
