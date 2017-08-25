
export default function convertImageUri(originalUri, requiredSize, useIiif, useOrigin) {

  const wordpressImageRoot = 'https://wellcomecollection.files.wordpress.com/';
  const prismicImageRoot = 'https://prismic-io.s3.amazonaws.com/wellcomecollection/';
  const miroImageRoot = 'https://s3-eu-west-1.amazonaws.com/miro-images-public/';
  const imgixPrismicSrcRoot = 'https://wellcomecollection-prismic.imgix.net';
  const imgixMiroSrcRoot = 'https://wellcomecollection-miro-images.imgix.net';
  const iiifWordpressSrcRoot = 'wordpress:';
  const iiifPrismicSrcRoot = 'prismic:';
  const iiifMiroSrcRoot = '';

  if (originalUri.startsWith(wordpressImageRoot)) {
    if (true) {
      return convertPathToIiifUri(originalUri.split(wordpressImageRoot)[1], iiifWordpressSrcRoot, requiredSize, false);
    } else {
      return originalUri + `?w=${requiredSize}`;
    }
  } else if (originalUri.startsWith(prismicImageRoot)) {
    if (true) {
      return convertPathToIiifUri(originalUri.split(prismicImageRoot)[1], iiifPrismicSrcRoot, requiredSize, false);
    } else {
      return convertPathToImgixUri(originalUri.split(prismicImageRoot)[1], imgixPrismicSrcRoot, requiredSize);
    }
  } else if (originalUri.startsWith(miroImageRoot)) {
    if (true) {
      return convertPathToIiifUri(originalUri.split(miroImageRoot)[1].split('/', 2)[1], iiifMiroSrcRoot, requiredSize, false);
    } else {
      return convertPathToImgixUri(originalUri.split(miroImageRoot)[1].split('/', 2)[1], imgixMiroSrcRoot, requiredSize);
    }
  } else {
    return originalUri;
  }
}

function convertPathToImgixUri(originalUriPath, imgixSrc, size) {
  return `${imgixSrc}/${originalUriPath}?w=${size}`;
}

function convertPathToIiifUri(originalUriPath, iiifSrc, size, useOrigin) {
  if (useOrigin) {
    return `https://iiif-origin.wellcomecollection.org/image/${iiifSrc}${originalUriPath}/full/${size},/0/default.jpg`;
  } else {
    return `https://iiif.wellcomecollection.org/image/${iiifSrc}${originalUriPath}/full/${size},/0/default.jpg`;
  }
}
