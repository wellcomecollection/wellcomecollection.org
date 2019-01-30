// @flow
import urlTemplate from 'url-template';

const imageMap = {
  wordpress: {
    root: 'https://wellcomecollection.files.wordpress.com/',
    iiifRoot: 'https://iiif.wellcomecollection.org/image/wordpress:',
    iiifOriginRoot: 'https://iiif-origin.wellcomecollection.org/image/wordpress:'
  },
  prismic: {
    cdnRoot: 'https://wellcomecollection.cdn.prismic.io/wellcomecollection/',
    root: 'https://prismic-io.s3.amazonaws.com/wellcomecollection/',
    iiifRoot: 'https://iiif.wellcomecollection.org/image/prismic:',
    iiifOriginRoot: 'https://iiif-origin.wellcomecollection.org/image/prismic:'
  },
  miro: {
    root: 'https://s3-eu-west-1.amazonaws.com/miro-images-public/',
    iiifRoot: 'https://iiif.wellcomecollection.org/image/',
    iiifOriginRoot: 'https://iiif-origin.wellcomecollection.org/image/'
  },
  iiif: { // sometimes we already have the iiif url, but we may want to convert it to use the origin
    root: 'https://iiif.wellcomecollection.org/image/',
    iiifRoot: 'https://iiif.wellcomecollection.org/image/',
    iiifOriginRoot: 'https://iiif-origin.wellcomecollection.org/image/'
  }
};

function determineSrc(url: string): string {
  if (url.startsWith(imageMap.wordpress.root)) {
    return 'wordpress';
  } else if (url.startsWith(imageMap.prismic.root) || url.startsWith(imageMap.prismic.cdnRoot)) {
    return 'prismic';
  } else if (url.startsWith(imageMap.miro.root)) {
    return 'miro';
  } else if (url.startsWith(imageMap.iiif.root)) {
    return 'iiif';
  } else {
    return 'unknown';
  }
}

function determineIfGif(originalUriPath) {
  return originalUriPath.slice(-4) === '.gif';
}

function determineFinalFormat(originalUriPath) {
  if (originalUriPath.slice(-4) === '.png') {
    return 'png';
  } else {
    return 'jpg';
  }
}

function convertPathToWordpressUri(originalUriPath, size) {
  return originalUriPath + `?w=${size}`;
}

function convertPathToIiifUri(originalUriPath, iiifRoot, size) {
  const isFullSize = size === 'full';
  const format = determineFinalFormat(originalUriPath);
  return `${iiifRoot}${originalUriPath}/full/${size}${isFullSize ? '' : ','}/0/default.${format}`;
}

export function convertIiifUriToInfoUri(originalUriPath: string) {
  if (originalUriPath.startsWith('https://iiif')) {
    const match = originalUriPath.match(/^https:\/\/iiif\.wellcomecollection\.org\/image\/(.+?\.[a-z]{3})/);
    if (match && match[0]) {
      return (`${match[0]}/info.json`);
    }
  } else {
    return `${originalUriPath}/info.json`;
  }
};

export function convertImageUri(originalUri: string, requiredSize: number | 'full', useIiifOrigin: boolean = false): string {
  const imageSrc = determineSrc(originalUri);
  const isGif = determineIfGif(originalUri);

  if (imageSrc === 'unknown') {
    return originalUri;
  } else {
    if (!isGif) {
      // $FlowFixMe
      const imagePath = imageSrc === 'miro' ? originalUri.split(imageMap[imageSrc].root)[1].split('/', 2)[1] : imageSrc === 'iiif' ? originalUri.split(imageMap[imageSrc].root)[1].split('/', 2)[0] : originalUri.split(imageMap[imageSrc].root)[1] ? originalUri.split(imageMap[imageSrc].root)[1] : originalUri.split(imageMap[imageSrc].cdnRoot)[1];
      const iiifRoot = useIiifOrigin ? imageMap[imageSrc].iiifOriginRoot : imageMap[imageSrc].iiifRoot;

      return convertPathToIiifUri(imagePath, iiifRoot, requiredSize);
    } else {
      if (imageSrc === 'wordpress') {
        return convertPathToWordpressUri(originalUri, requiredSize);
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
  format?: string
};
export function iiifImageTemplate(infoJsonLocation: string) {
  const baseUrl = infoJsonLocation.replace('/info.json', '');
  const templateString = `${baseUrl}/{region}/{size}/{rotation}/{quality}.{format}`;
  const defaultOpts = {
    region: 'full',
    size: 'full',
    rotation: 0,
    quality: 'default',
    format: 'jpg'
  };
  const template = urlTemplate.parse(templateString);
  return (opts: IiifUriOpts) => template.expand(Object.assign({}, defaultOpts, opts));
}
