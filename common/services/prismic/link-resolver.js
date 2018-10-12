// @flow
// We haven't typed this explicitly as it's used in non-babled places
// But flow will infer a return type of string.
function linkResolver(doc) {
  switch (doc.type) {
    case 'articles'         : return `/articles/${doc.id}`;
    case 'webcomics'        : return `/articles/${doc.id}`;
    case 'exhibitions'      : return `/exhibitions/${doc.id}`;
    case 'events'           : return `/events/${doc.id}`;
    case 'series'           : return `/series/${doc.id}`;
    case 'webcomic-series'  : return `/webcomic-series/${doc.id}`;
    case 'event-series'     : return `/event-series/${doc.id}`;
    case 'installations'    : return `/installations/${doc.id}`;
    case 'pages'            : return `/pages/${doc.id}`;
    case 'books'            : return `/books/${doc.id}`;
    default                 : return '/';
  }
}

module.exports = linkResolver;
