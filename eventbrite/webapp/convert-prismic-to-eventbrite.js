const {RichText} = require('prismic-dom');

export function convertPrismicEventToEventbrightSeries(json) {
  const {data} = json;
  const id = /\/e\/([0-9]+)/.exec(data.eventbriteEvent.url);
  const name = data.title[0].text;
  const description = RichText.asHtml(data.body
    .filter(slice => slice.slice_type === 'text')
    .map(slice => slice.primary.text)
    .reduce((acc, text) => {
      return acc.concat(text);
    }));

  return {
    series_parent: {
      name: {
        html: `${name}`
      },
      description: {
        html: description
      }
    }
  };
}

export function convertPrismicEventToEventbrightEvent(json) {
  const {data} = json;
  const name = data.title[0].text;
  const description = RichText.asHtml(data.body
    .filter(slice => slice.slice_type === 'text')
    .map(slice => slice.primary.text)
    .reduce((acc, text) => {
      return acc.concat(text);
    }));

  return {
    name: {
      html: `${name}`
    },
    description: {
      html: description
    }
  };
}
