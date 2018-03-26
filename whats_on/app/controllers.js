import {getInstallation} from '@weco/common/services/prismic/installations';
import {model, prismic} from 'common';

import {
  shopPromo,
  cafePromo,
  readingRoomPromo,
  restaurantPromo,
  spiritBoothPromo,
  dailyTourPromo
} from '../../server/data/facility-promos';
const {createPageConfig} = model;
const {
  getExhibitionAndEventPromos,
  getGlobalAlert
} = prismic;

export async function renderWhatsOn(ctx, next) {
  const exhibitionAndEventPromosPromise = getExhibitionAndEventPromos(ctx.query);
  const globalAlertPromise = getGlobalAlert();
  const [ exhibitionAndEventPromos, globalAlert ] = await Promise.all([exhibitionAndEventPromosPromise, globalAlertPromise]);

  ctx.render('pages/whats-on', {
    pageConfig: createPageConfig({
      globalAlert: globalAlert,
      path: ctx.request.url,
      title: 'What\'s on',
      inSection: 'whatson',
      category: 'public-programme',
      contentType: 'list',
      canonicalUri: '/whats-on',
      pageState: {
        dateRangeName: exhibitionAndEventPromos.active
      }
    }),
    exhibitionAndEventPromos,
    tryTheseTooPromos: [readingRoomPromo, spiritBoothPromo],
    eatShopPromos: [cafePromo, shopPromo, restaurantPromo],
    cafePromo,
    shopPromo,
    dailyTourPromo
  });

  return next();
}

export async function renderInstallation(ctx, next) {
  const installationPromise = getInstallation(ctx.request, ctx.params.id);
  const globalAlertPromise = getGlobalAlert();
  const [
    {installation, featredImageList},
    globalAlert
  ] = await Promise.all([installationPromise, globalAlertPromise]);
  const tags = [{
    text: 'Installations',
    url: '/installations'
  }];
  ctx.render('pages/installation', {
    pageConfig: createPageConfig({
      globalAlert: globalAlert,
      path: ctx.request.url,
      title: installation.title,
      inSection: 'whatson',
      category: 'public-programme',
      contentType: 'installation',
      canonicalUri: `/installation/${installation.id}`
    }),
    installation,
    featredImageList,
    tags
  });
}
