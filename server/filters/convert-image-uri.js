
export default function convertImageUri(originalUri, requiredSize) {
  const wordpressImageRoot = 'https://wellcomecollection.files.wordpress.com/';
  const prismicImageRoot = 'https://prismic-io.s3.amazonaws.com/wellcomecollection/';
  const miroImageRoot = 'https://s3-eu-west-1.amazonaws.com/miro-images-public/';
  const imgixPrismicSrcRoot = 'https://wellcomecollection-prismic.imgix.net';
  const imgixMiroSrcRoot = 'https://wellcomecollection-miro-images.imgix.net';

  if (originalUri.startsWith(wordpressImageRoot)) {
    return originalUri + `?w=${requiredSize}`;
  } else if (originalUri.startsWith(prismicImageRoot)) {
    return convertPathToImgixUri(originalUri, prismicImageRoot, imgixPrismicSrcRoot, requiredSize);
  } else if (originalUri.startsWith(miroImageRoot)) {
    return convertPathToImgixUri(originalUri, miroImageRoot, imgixMiroSrcRoot, requiredSize);
  } else {
    return originalUri;
  }
}

function convertPathToImgixUri(originalUri, root, imgixSrc, size) {
  const imgPath = originalUri.split(root)[1];
  return `${imgixSrc}/${imgPath}?w=${size}`;
}
