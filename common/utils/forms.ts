import { ParsedUrlQuery } from 'querystring';

export function inputValue(input: HTMLElement | undefined): string | undefined {
  if (!input) return;

  if (
    input instanceof window.HTMLInputElement ||
    input instanceof window.HTMLSelectElement ||
    (window.RadioNodeList && input instanceof window.RadioNodeList)
  ) {
    return input.value;
  }

  if (!window.RadioNodeList && input instanceof window.HTMLCollection) {
    // IE11 treats radios as an HTMLCollection
    return Array.from<any>(input).find((i: any) => i.checked)?.value;
  }
}

export function nodeListValueToArray(
  input: HTMLElement | undefined
): HTMLInputElement[] | undefined {
  if (!input) return;

  if (input instanceof window.HTMLInputElement) {
    return [input];
  }

  if (
    input instanceof window.NodeList ||
    input instanceof window.HTMLCollection // IE11 reports checkboxes as HTMLCollections
  ) {
    return Array.from<any>(input);
  }
}

/**
 * Converts form data into the GET request that it would produce if it
 * were submitted in the shape of `ParsedUrlQuery`.
 *
 * TODO: write tests for this
 */
export function formDataAsUrlQuery(form: HTMLFormElement): ParsedUrlQuery {
  const formData = new FormData(form);
  // see: https://github.com/microsoft/TypeScript/issues/30584
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const url = new URLSearchParams(formData);

  const query = Array.from(url.entries()).reduce((acc, [key, value]) => {
    if (key in acc) {
      return {
        ...acc,
        [key]: Array.isArray(acc[key])
          ? acc[key].concat(value)
          : [acc[key]].concat(value),
      };
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});

  return query;
}
