const axios = require('axios');
const {convertPrismicEventToEventbrightSeries} = require('../convert-prismic-to-eventbrite');
const seriesJson = require('../__mocks__/series.json');
const eventJson = require('../__mocks__/event.json');
const token = '';
const instance = axios.create({
  baseURL: `https://www.eventbriteapi.com/v3`
});
instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
instance.defaults.headers.common['Content-Type'] = `application/json`;

async function getEbEvent(id) {
  const ebEvent = await instance.get(`/events/${id}`);
  return ebEvent;
}

function getEventbriteId(prEvent) {
  const idMatch = /\/e\/([0-9]+)/.exec(prEvent.data.eventbriteEvent.url);
  if (idMatch) {
    const id = idMatch[1];
    return id;
  }
}

test('converts prismic event to eventbrite series', () => {
  const {series_parent} = convertPrismicEventToEventbrightSeries(seriesJson);
  expect(series_parent.name.html).toBe('Test: Sync series with prismic');
});

test('looks up eventbrite event properly', async () => {
  // const seriesId = getEventbriteId(seriesJson);
  // const ebSeries = await instance.get(`/events/${id}`);
  // const ebSeries = await instance.get(`/events/${id}`);

  // expect(ebSeries.is_series).toBe(true)
  // console.info(ebEvent);
});

test('updates eventbrite series', async () => {
  const prEvent = seriesJson;
  const idMatch = /\/e\/([0-9]+)/.exec(seriesJson.data.eventbriteEvent.url);

  if (idMatch) {
    const id = idMatch[1];
    const ebEvent = await getEbEvent(id);
    const isSeriesParent = ebEvent.data.is_series_parent;
    const imageUrl = prEvent.data.promo
      .map(slice => slice.primary.image && slice.primary.image['16:9'].url)
      .filter(Boolean).find(_ => _);

    const image = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });

    const uploadData = await instance.get('/media/upload/', {
      params: {
        type: 'image-event-logo'
      }
    });

    try {
      const uploader = await axios.post(
        uploadData.upload_url,
        {
          AWSAccessKeyId: uploadData.AWSAccessKeyId,
          bucket: uploadData.bucket,
          acl: uploadData.acl,
          key: uploadData.key,
          signature: uploadData.signature,
          policy: uploadData.policy,
          file: image.data
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      // console.info(uploader.body);
    } catch (e) {
      console.info(e.body);
      expect(e.body).toBe(100);
    }
    // const res = await instance.post(
    //   `/${isSeriesParent ? 'series' : 'events'}/${id}/`,
    //   JSON.stringify(event),
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${tok}`
    //     }
    //   }
    // );
  }
});
