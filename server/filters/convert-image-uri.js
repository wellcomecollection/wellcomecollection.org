const imageMap = {
  wordpress: {
    root: 'https://wellcomecollection.files.wordpress.com/',
    iiifRoot: 'https://iiif.wellcomecollection.org/image/wordpress:',
    iiifOriginRoot: 'https://iiif-origin.wellcomecollection.org/image/wordpress:'
  },
  prismic: {
    root: 'https://prismic-io.s3.amazonaws.com/wellcomecollection/',
    imigixRoot: 'https://wellcomecollection-prismic.imgix.net',
    iiifRoot: 'https://iiif.wellcomecollection.org/image/prismic:',
    iiifOriginRoot: 'https://iiif-origin.wellcomecollection.org/image/prismic:'
  },
  miro: {
    root: 'https://s3-eu-west-1.amazonaws.com/miro-images-public/',
    imigixRoot: 'https://wellcomecollection-miro-images.imgix.net',
    iiifRoot: 'https://iiif.wellcomecollection.org/image/',
    iiifOriginRoot: 'https://iiif-origin.wellcomecollection.org/image/'
  },
  iiif: { // sometimes we already have the iiif url, but we may want to convert it to use the origin
    root: 'https://iiif.wellcomecollection.org/image/',
    iiifRoot: 'https://iiif.wellcomecollection.org/image/',
    iiifOriginRoot: 'https://iiif-origin.wellcomecollection.org/image/'
  }
};

function determineSrc(url) {
  if (url.startsWith(imageMap.wordpress.root)) {
    return 'wordpress';
  } else if (url.startsWith(imageMap.prismic.root)) {
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

function convertPathToWordpressUri(originalUriPath, size) {
  return originalUriPath + `?w=${size}`;
}

function convertPathToImgixUri(originalUriPath, imgixRoot, size) {
  return `${imgixRoot}/${originalUriPath}?w=${size}`;
}

function convertPathToIiifUri(originalUriPath, iiifRoot, size) {
  return `${iiifRoot}${originalUriPath}/full/${size},/0/default.jpg`;
}

export default function convertImageUri(originalUri, requiredSize, useIiif, useIiifOrigin) {
  if (originalUri) {
    const imageSrc = determineSrc(originalUri);
    const isGif = determineIfGif(originalUri);

    if (imageSrc === 'unknown') {
      return originalUri;
    } else {
      if (useIiif && !isGif) {
        const imagePath = imageSrc === 'miro' ? originalUri.split(imageMap[imageSrc].root)[1].split('/', 2)[1] : imageSrc === 'iiif' ? originalUri.split(imageMap[imageSrc].root)[1].split('/', 2)[0] : originalUri.split(imageMap[imageSrc].root)[1];
        const iiifRoot = useIiifOrigin ? imageMap[imageSrc].iiifOriginRoot : imageMap[imageSrc].iiifRoot;

        return convertPathToIiifUri(imagePath, iiifRoot, requiredSize);
      } else {
        if (imageSrc === 'iiif') { // we have to use the iiif uri as that is all we have
          return originalUri;
        } else if (imageSrc === 'wordpress') {
          return convertPathToWordpressUri(originalUri, requiredSize);
        } else {
          return convertPathToImgixUri(originalUri.split(imageMap[imageSrc].root)[1], imageMap[imageSrc].imigixRoot, requiredSize);
        }
      }
    }
  }
}
