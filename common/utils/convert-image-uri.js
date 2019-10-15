// @flow
import urlTemplate from 'url-template';

const imageMap = {
  wordpress: {
    root: 'https://wellcomecollection.files.wordpress.com/',
    iiifRoot: 'https://iiif.wellcomecollection.org/image/wordpress:',
  },
  prismicImgix: {
    root: 'https://images.prismic.io/wellcomecollection/',
  },
  prismic: {
    root: 'https://wellcomecollection.cdn.prismic.io/wellcomecollection/',
    iiifRoot: 'https://iiif.wellcomecollection.org/image/prismic:',
  },
  miro: {
    root: 'https://s3-eu-west-1.amazonaws.com/miro-images-public/',
    iiifRoot: 'https://iiif.wellcomecollection.org/image/',
  },
  iiif: {
    // sometimes we already have the iiif url, but we may want to convert it to use the origin
    root: 'https://iiif.wellcomecollection.org/image/',
    iiifRoot: 'https://iiif.wellcomecollection.org/image/',
  },
};

function determineSrc(url: string): string {
  if (url.startsWith(imageMap.wordpress.root)) {
    return 'wordpress';
  } else if (url.startsWith(imageMap.prismic.root)) {
    return 'prismic';
  } else if (url.startsWith(imageMap.prismicImgix.root)) {
    return 'prismicImgix';
  } else if (url.startsWith(imageMap.miro.root)) {
    return 'miro';
  } else if (url.startsWith(imageMap.iiif.root)) {
    return 'iiif';
  } else {
    return 'unknown';
  }
}

function determineIfGif(originalUriPath) {
  return originalUriPath.includes('.gif');
}

function determineFinalFormat(originalUriPath) {
  if (originalUriPath.includes('.png')) {
    return 'png';
  } else {
    return 'jpg';
  }
}

type prismicUriOpts = {
  auto?: string,
  rect?: string,
  w?: number | 'full',
  h?: number,
};

function prismicImageTemplate(baseUrl: string) {
  const templateString = `${baseUrl}?auto={auto}&rect={rect}&w={w}&h={h}`;
  const template = urlTemplate.parse(templateString);
  return (opts: prismicUriOpts) => {
    return template.expand(opts);
  };
}

type wordpressUriOpts = {|
  width?: number | 'full',
|};

function wordPressImageTemplate(baseUrl: string) {
  const templateString = `${baseUrl}?w={width}`;
  const defaultOpts = {
    width: 'full',
  };
  const template = urlTemplate.parse(templateString);
  return (opts: wordpressUriOpts) =>
    template.expand(Object.assign({}, defaultOpts, opts));
}

type iiifTemplateOpts = {|
  imagePath: string,
  size?: string,
  format?: 'jpg' | 'png',
|};

function iiifTemplate(baseUrl: string) {
  const templateString = `${baseUrl}{imagePath}/full/{size}/0/default.{format}`;
  const defaultOpts = {
    size: 'full',
    format: 'jpg',
  };
  const template = urlTemplate.parse(templateString);
  return (opts: iiifTemplateOpts) =>
    template.expand(Object.assign({}, defaultOpts, opts));
}

function paramsToObject(entries) {
  return Array.from(entries).reduce((acc, curr) => {
    const [key, value] = curr;
    acc[key] = value;
    return acc;
  }, {});
}

function prismicTemplateParts(
  originalUri: string,
  requiredSize: number | 'full'
) {
  const uriParts = originalUri.split('?');
  const base = uriParts[0];
  const queryString = uriParts[1];
  const urlParams = queryString && new URLSearchParams(`?${queryString}`);
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
          w: requiredSize,
        };
  return {
    base,
    params,
  };
}

export function convertImageUri(
  originalUri: string,
  requiredSize: number | 'full'
): string {
  const imageSrc = determineSrc(originalUri);
  const isGif = determineIfGif(originalUri);
  if (imageSrc === 'unknown') {
    return originalUri;
  } else if (imageSrc === 'prismicImgix') {
    const parts = prismicTemplateParts(originalUri, requiredSize);
    return prismicImageTemplate(parts.base)({
      ...parts.params,
    });
  } else {
    if (!isGif) {
      const imagePath =
        imageSrc === 'miro'
          ? originalUri.split(imageMap[imageSrc].root)[1].split('/', 2)[1]
          : imageSrc === 'iiif'
          ? originalUri.split(imageMap[imageSrc].root)[1].split('/', 2)[0]
          : originalUri.split(imageMap[imageSrc].root)[1];
      const iiifRoot = imageMap[imageSrc].iiifRoot;

      const params = {
        imagePath,
        size: requiredSize === 'full' ? 'full' : `${requiredSize},`,
        format: determineFinalFormat(originalUri),
      };
      return iiifTemplate(iiifRoot)(params);
    } else {
      if (imageSrc === 'wordpress') {
        return wordPressImageTemplate(originalUri)({ width: requiredSize });
      } else {
        return originalUri;
      }
    }
  }
}

type IiifUriOpts = {
  region?: string,
  size?: string,
  rotation?: number,
  quality?: string,
  format?: string,
};

export function iiifImageTemplate(infoJsonLocation: string) {
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
  return (opts: IiifUriOpts) =>
    template.expand(Object.assign({}, defaultOpts, opts));
}

export function convertIiifUriToInfoUri(originalUriPath: string) {
  const match = originalUriPath.match(
    /^https:\/\/iiif\.wellcomecollection\.org\/image\/(.+?\.[a-z]{3})/
  );
  if (match && match[0]) {
    return `${match[0]}/info.json`;
  } else {
    return `${originalUriPath}/info.json`;
  }
}
