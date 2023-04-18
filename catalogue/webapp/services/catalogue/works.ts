import { CatalogueApiError, CatalogueApiRedirect, Work } from './types';

type WorkResponse =
  | (Work & { url: string })
  | CatalogueApiError
  | CatalogueApiRedirect;

export async function getWorkClientSide(workId: string): Promise<WorkResponse> {
  // passing credentials: 'same-origin' ensures we pass the cookies to
  // the API; in particular the toggle cookies
  const response = await fetch(`/api/works/${workId}`, {
    credentials: 'same-origin',
  });

  const resp = await response.json();

  if (resp.type === 'Redirect') {
    return getWorkClientSide(resp.redirectToId);
  } else {
    return resp;
  }
}
