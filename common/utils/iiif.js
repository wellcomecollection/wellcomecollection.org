// @flow
import {
  type IIIFManifest,
  type IIIFRendering,
  type IIIFMetadata,
  type IIIFCanvas,
  type IIIFMediaElement,
} from '../model/iiif';

export function getIIIFMetadata(
  iiifManifest: IIIFManifest,
  label: string
): ?IIIFMetadata {
  const repository = iiifManifest.metadata.find(data => data.label === label);
  return repository;
}

export function getDownloadOptionsFromManifest(
  iiifManifest: IIIFManifest
): IIIFRendering[] {
  const sequence =
    iiifManifest.sequences &&
    iiifManifest.sequences.find(
      sequence => sequence['@type'] === 'sc:Sequence'
    );
  const sequenceRendering = sequence && sequence.rendering;
  const sequenceRenderingArray = Array.isArray(sequenceRendering)
    ? sequenceRendering
    : [sequenceRendering];

  const pdfRenderingArray = iiifManifest.mediaSequences
    ? iiifManifest.mediaSequences.reduce((acc, sequence) => {
        return acc.concat(
          sequence.elements
            .map(element => {
              return {
                '@id': element['@id'],
                format: element.format,
                label: `Download ${
                  element.format === 'application/pdf' ? 'PDF' : 'file'
                }`,
              };
            })
            .filter(Boolean)
        );
      }, [])
    : [];
  return [...sequenceRenderingArray, ...pdfRenderingArray].filter(Boolean);
}

export function getCanvases(iiifManifest: IIIFManifest): IIIFCanvas[] {
  const sequence =
    iiifManifest.sequences &&
    iiifManifest.sequences.find(
      sequence =>
        sequence['@type'] === 'sc:Sequence' &&
        sequence.compatibilityHint !== 'displayIfContentUnsupported'
    );
  return sequence ? sequence.canvases : [];
}

export function getVideo(iiifManifest: IIIFManifest): ?IIIFMediaElement {
  const videoSequence =
    iiifManifest &&
    iiifManifest.mediaSequences &&
    iiifManifest.mediaSequences.find(sequence =>
      sequence.elements.find(
        element => element['@type'] === 'dctypes:MovingImage'
      )
    );
  return (
    videoSequence &&
    videoSequence.elements.find(
      element => element['@type'] === 'dctypes:MovingImage'
    )
  );
}

export function getAudio(iiifManifest: IIIFManifest): ?IIIFMediaElement {
  const videoSequence =
    iiifManifest &&
    iiifManifest.mediaSequences &&
    iiifManifest.mediaSequences.find(sequence =>
      sequence.elements.find(element => element['@type'] === 'dctypes:Sound')
    );
  return (
    videoSequence &&
    videoSequence.elements.find(element => element['@type'] === 'dctypes:Sound')
  );
}

export function getAnnotationFromMediaElement(
  mediaElement: IIIFMediaElement
): ?Object {
  return (
    mediaElement.resources &&
    mediaElement.resources.find(
      resource => resource['@type'] === 'oa:Annotation'
    )
  );
}

export function getFirstChildManifestLocation(iiifManifest: IIIFManifest) {
  if (iiifManifest.manifests) {
    return iiifManifest.manifests.find(manifest => manifest['@id'])['@id'];
  } else {
    return null;
  }
}

export function getIIIFPresentationCredit(manifest: IIIFManifest): ?string {
  const attribution = getIIIFMetadata(manifest, 'Attribution');
  return attribution ? attribution.value.split('<br/>')[0] : null;
}

function getManifests(iiifManifest: IIIFManifest): IIIFManifest[] {
  return iiifManifest.manifests || [];
}

export function getManifestViewType(
  iiifManifest: IIIFManifest
): 'multi' | 'audio' | 'video' | 'iiif' | 'pdf' | 'none' {
  const manifests = getManifests(iiifManifest);
  const video =
    iiifManifest.mediaSequences &&
    iiifManifest.mediaSequences.find(sequence =>
      sequence.elements.find(
        element => element['@type'] === 'dctypes:MovingImage'
      )
    );
  const audio =
    iiifManifest.mediaSequences &&
    iiifManifest.mediaSequences.find(sequence =>
      sequence.elements.find(element => element['@type'] === 'dctypes:Sound')
    );
  const canvases = getCanvases(iiifManifest);
  const downloadOptions = getDownloadOptionsFromManifest(iiifManifest);
  const pdfRendering =
    downloadOptions.find(option => option.label === 'Download PDF') || false;
  return manifests
    ? 'multi'
    : audio
    ? 'audio'
    : video
    ? 'video'
    : canvases.length > 0
    ? 'iiif'
    : pdfRendering
    ? 'pdf'
    : 'none';
}
