const multiManifest = {
  "@context": "http://iiif.io/api/presentation/2/context.json",
  "@id": "https://wellcomelibrary.org/iiif/collection/b18031961",
  "@type": "sc:Collection",
  "label": "The life and letters of Charles Darwin : including an autobiographical chapter",
  "metadata": [
  {
  "label": "Title",
  "value": "The life and letters of Charles Darwin :"
  },
  {
  "label": "Author(s)",
  "value": "Darwin, Charles; Darwin, Francis"
  },
  {
  "label": "Publication date",
  "value": "1887."
  },
  {
  "label": "",
  "value": "<a href='https://search.wellcomelibrary.org/iii/encore/record/C__Rb1803196'>View full catalogue record</a>"
  },
  {
  "label": "Full conditions of use",
  "value": "This work has been identified as being free of known restrictions under copyright law, including all related and neighbouring rights and is being made available under the <a target=\"_top\" href=\"http://creativecommons.org/publicdomain/mark/1.0/\">Creative Commons, Public Domain Mark</a>.<br/><br/>You can copy, modify, distribute and perform the work, even for commercial purposes, without asking permission."
  }
  ],
  "license": "https://creativecommons.org/publicdomain/mark/1.0/",
  "logo": "https://wellcomelibrary.org/assets/img/squarelogo64.png",
  "related": {
  "@id": "https://wellcomelibrary.org/item/b18031961",
  "format": "text/html"
  },
  "seeAlso": [
  {
  "@id": "https://wellcomelibrary.org/data/b18031961.json",
  "format": "application/json",
  "profile": "http://wellcomelibrary.org/profiles/res"
  },
  {
  "@id": "https://wellcomelibrary.org/resource/schemaorg/b18031961",
  "format": "application/ld+json",
  "profile": "http://iiif.io/community/profiles/discovery/schema"
  },
  {
  "@id": "https://wellcomelibrary.org/resource/dublincore/b18031961",
  "format": "application/ld+json",
  "profile": "http://iiif.io/community/profiles/discovery/dc"
  }
  ],
  "service": {
  "@context": "http://universalviewer.io/context.json",
  "@id": "http://wellcomelibrary.org/service/trackingLabels/b18031961",
  "profile": "http://universalviewer.io/tracking-extensions-profile",
  "trackingLabel": "Format: monograph, Institution: n/a, Identifier: b18031961, Digicode: diggenetics, Collection code: n/a"
  },
  "viewingHint": "multi-part",
  "manifests": [
  {
  "@id": "https://wellcomelibrary.org/iiif/b18031961-0/manifest",
  "@type": "sc:Manifest",
  "label": "Volume 1"
  },
  {
  "@id": "https://wellcomelibrary.org/iiif/b18031961-1/manifest",
  "@type": "sc:Manifest",
  "label": "Volume 2"
  },
  {
  "@id": "https://wellcomelibrary.org/iiif/b18031961-2/manifest",
  "@type": "sc:Manifest",
  "label": "Volume 3"
  }
  ]
  }

export default multiManifest;
