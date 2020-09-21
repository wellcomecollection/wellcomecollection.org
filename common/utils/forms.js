// @flow
export function inputValue(input: ?HTMLElement): ?string {
  if (
    input &&
    (input instanceof window.HTMLInputElement ||
      input instanceof window.HTMLSelectElement ||
      (window.RadioNodeList && input instanceof window.RadioNodeList))
  ) {
    return input.value;
  }

  if (!window.RadioNodeList && input instanceof window.HTMLCollection) {
    // IE11 treats radios as an HTMLCollection
    return Array.from(input).find(i => i.checked).value;
  }
}

export function nodeListValueToArray(
  input: ?HTMLElement
): ?(HTMLInputElement[]) {
  if (!input) return;

  if (input instanceof window.HTMLInputElement) {
    return [input];
  }

  if (
    input instanceof window.NodeList ||
    input instanceof window.HTMLCollection // IE11 reports checkboxes as HTMLCollections
  ) {
    return Array.from(input);
  }
}
