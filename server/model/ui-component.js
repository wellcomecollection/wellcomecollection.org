// @flow
// type: ui-component
import {type Weight} from "./weight";

// Annoyingly exact object intersetion is not supported, so UiComponents will have to remain inexact
// for now.
// See: https://github.com/facebook/flow/issues/2626
export type UiComponent = {
  modifiers?: Array<string>;
  weight?: Weight;
}
