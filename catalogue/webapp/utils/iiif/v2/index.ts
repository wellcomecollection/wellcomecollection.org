import {
  IIIFManifest,
  IIIFMetadata,
  IIIFStructure,
  IIIFMediaElement,
  IIIFCanvas,
  Service,
  IIIFAnnotationResource,
} from '../../../../webapp/services/iiif/types/manifest/v2';
import { TransformedCanvas } from '../../../types/manifest';
import { Manifest, Range } from '@iiif/presentation-3';
import { fetchJson } from '@weco/common/utils/http';
import cloneDeep from 'lodash.clonedeep';
import { getEnFromInternationalString } from '../v3';

export function getServiceId(canvas?: IIIFCanvas): string | undefined {
  const serviceSrc = canvas?.images[0]?.resource?.service;
  if (serviceSrc) {
    if (Array.isArray(serviceSrc)) {
      const service = serviceSrc.find(
        item => item['@context'] === 'http://iiif.io/api/image/2/context.json'
      );
      return service && service['@id'];
    } else {
      return serviceSrc['@id'];
    }
  }
}

export function getUiExtensions(
  iiifManifest: IIIFManifest
): Service | undefined {
  if (iiifManifest.service) {
    if (
      !Array.isArray(iiifManifest.service) &&
      iiifManifest.service.profile ===
        'http://universalviewer.io/ui-extensions-profile'
    ) {
      return iiifManifest.service;
    } else if (Array.isArray(iiifManifest.service)) {
      return iiifManifest.service.find(
        service =>
          service.profile === 'http://universalviewer.io/ui-extensions-profile'
      );
    }
  }
}

export function isUiEnabled(
  uiExtensions: Service | undefined,
  uiName: string
): boolean {
  const disableUI = uiExtensions && uiExtensions.disableUI;
  if (disableUI) {
    return !(
      disableUI.includes(uiName) || disableUI.includes(uiName.toLowerCase())
    );
  }
  return true;
}

export function getIIIFMetadata(
  iiifManifest: IIIFManifest,
  label: string
): IIIFMetadata | undefined {
  return iiifManifest.metadata.find(data => data.label === label);
}

export function getStructures(iiifManifest: IIIFManifest): IIIFStructure[] {
  return iiifManifest?.structures || [];
}

// When lots of the works were digitised, structures with multiple pages such as table of contents
// were created individually, rather than as a single structure with a range of pages.
// This means we will often display repetitive links to the essentially the same thing.
// Until we can improve the data at source, this function groups structures that have the same label attached to consecutive pages into a single structure.
export function groupStructures(
  items: TransformedCanvas[],
  structures: Range[]
): Range[] {
  const clonedStructures = cloneDeep(structures);
  return clonedStructures.reduce(
    (acc, structure) => {
      if (!structure.items) return acc;

      const [lastCanvasInRange] = structure.items.slice(-1);
      const [firstCanvasInRange] = structure.items;
      const firstCanvasIndex = items.findIndex(
        canvas => canvas.id === firstCanvasInRange.id
      );

      if (
        getEnFromInternationalString(acc.previousLabel) ===
          getEnFromInternationalString(structure.label) &&
        firstCanvasIndex === acc.previousLastCanvasIndex + 1
      ) {
        acc.groupedArray[acc.groupedArray.length - 1].items.push(
          lastCanvasInRange
        );
      } else if (structure.items.length > 0) {
        acc.groupedArray.push(structure);
      }
      acc.previousLabel = structure.label;
      acc.previousLastCanvasIndex = items.findIndex(
        canvas => canvas.id === lastCanvasInRange.id
      );
      return acc;
    },
    {
      previousLastCanvasIndex: null,
      previousLabel: { none: '' },
      groupedArray: [],
    }
  ).groupedArray;
}

export function getAnnotationFromMediaElement(
  mediaElement: IIIFMediaElement
): IIIFAnnotationResource | undefined {
  return (
    mediaElement.resources &&
    mediaElement.resources.find(
      resource => resource['@type'] === 'oa:Annotation'
    )
  );
}

export function getIIIFPresentationCredit(
  manifest: IIIFManifest
): string | undefined {
  const attribution = getIIIFMetadata(manifest, 'Attribution');
  return attribution?.value.split('<br/>')[0];
}

export async function getIIIFManifest(
  url: string
): Promise<IIIFManifest | Manifest> {
  const manifest = await fetchJson(url);
  return manifest;
}
