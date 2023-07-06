import IIIFViewer from './IIIFViewer';

// canvas and manifest params use 1-based indexing, but are used to access items in 0 indexed arrays,
// so we need to convert it in various places
export function queryParamToArrayIndex(canvas: number): number {
  return canvas - 1;
}

export function arrayIndexToQueryParam(canvasIndex: number): number {
  return canvasIndex + 1;
}

export default IIIFViewer;
