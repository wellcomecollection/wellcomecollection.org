export function objToJsonLd<T>(obj: T, type: string, root = true) {
  const jsonObj = JSON.parse(JSON.stringify(obj));
  const jsonLdAddition = root
    ? {
        '@context': 'http://schema.org',
        '@type': type,
      }
    : { '@type': type };
  return Object.assign({}, jsonObj, jsonLdAddition);
}

export function breadcrumbsLd(breadcrumbs) {
  return objToJsonLd(
    {
      itemListElement: breadcrumbs.items.map(({ url, text }, i) => {
        return objToJsonLd(
          {
            position: i,
            name: text,
            item: `https://wellcomecollection.org${url}`,
          },
          'ListItem',
          false
        );
      }),
    },
    'BreadcrumbList'
  );
}

export function webpageLd(url) {
  return objToJsonLd({ url }, 'WebPage');
}
