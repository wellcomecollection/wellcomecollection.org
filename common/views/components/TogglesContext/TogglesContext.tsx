import { createContext } from 'react';
import { Toggles } from '@weco/toggles';
import cookies from 'next-cookies';
import { NextPageContext } from 'next';
import { toggles as togglesCache } from '../../../services/cache';

export const parseTogglesFromPageContext = (
  context: NextPageContext
): Toggles => {
  const allCookies = cookies(context);
  const cookiedToggles: Toggles = togglesCache.toggles
    .map(toggle => {
      return {
        id: toggle.id,
        active:
          allCookies[`toggle_${toggle.id}`] === 'true' ?? toggle.defaultValue,
      };
    })
    .reduce((acc, toggle) => {
      return {
        ...acc,
        [toggle.id]: toggle.active,
      };
    }, {});

  return cookiedToggles;
};

const TogglesContext = createContext<Toggles>({} as Toggles);
export default TogglesContext;
