// @flow
// We use comments types here as we use this in non-babeled places
/*::
type Doc = {|
  id: string,
  type: string
|}
*/

function linkResolver(doc /* :Doc */) /* :string */ {
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
