const videoManifest = {
  "@context": [
  "http://iiif.io/api/presentation/2/context.json",
  "http://wellcomelibrary.org/ld/ixif/0/context.json"
  ],
  "@id": "https://wellcomelibrary.org/iiif/b16676166/manifest",
  "@type": "sc:Manifest",
  "label": "Cruel kindness.",
  "metadata": [
  {
  "label": "Title",
  "value": "Cruel kindness."
  },
  {
  "label": "Credits",
  "value": "An Oswalk Skilbeck production for the Film Producers Guild, made in association with Film Centre International Ltd. Written and directed by Winifred Holmes and produced by  the British Life Assurance Trust for Health Education with the British Medical Association."
  },
  {
  "label": "Date",
  "value": "1968."
  },
  {
  "label": "Physical Description",
  "value": "1 encoded moving image (13 min.) : sound, color"
  },
  {
  "label": "Summary",
  "value": "This extremely enjoyable film, which contains excellent footage of late 1960's home life, attitudes to food and meal times, addresses obesity in children. A female GP narrates the story of three children who are overweight for their age stressing that although there may be some inherited causes of their obesity, it is mostly due to over-feeding on the part of the parents, what the GP calls a cruel kindness. "
  },
  {
  "label": "Attribution",
  "value": "Wellcome Collection<br/>License: CC-BY-NC"
  },
  {
  "label": "",
  "value": "<a href='https://search.wellcomelibrary.org/iii/encore/record/C__Rb1667616'>View full catalogue record</a>"
  },
  {
  "label": "Full conditions of use",
  "value": "You have permission to make copies of this work under a <a target=\"_top\" href=\"http://creativecommons.org/licenses/by-nc/4.0/\">Creative Commons, Attribution, Non-commercial license</a>.<br/><br/>Non-commercial use includes private study, academic research, teaching, and other activities that are not primarily intended for, or directed towards, commercial advantage or private monetary compensation. See the <a target=\"_top\" href=\"http://creativecommons.org/licenses/by-nc/4.0/legalcode\">Legal Code</a> for further information.<br/><br/>Image source should be attributed as specified in the full catalogue record. If no source is given the image should be attributed to Wellcome Library."
  }
  ],
  "license": "https://creativecommons.org/licenses/by-nc/4.0/",
  "logo": "https://wellcomelibrary.org/assets/img/squarelogo64.png",
  "related": {
  "@id": "https://wellcomelibrary.org/item/b16676166",
  "format": "text/html"
  },
  "seeAlso": [
  {
  "@id": "https://wellcomelibrary.org/data/b16676166.json",
  "format": "application/json",
  "profile": "http://wellcomelibrary.org/profiles/res"
  },
  {
  "@id": "https://wellcomelibrary.org/resource/schemaorg/b16676166",
  "format": "application/ld+json",
  "profile": "http://iiif.io/community/profiles/discovery/schema"
  },
  {
  "@id": "https://wellcomelibrary.org/resource/dublincore/b16676166",
  "format": "application/ld+json",
  "profile": "http://iiif.io/community/profiles/discovery/dc"
  }
  ],
  "service": {
  "@context": "http://universalviewer.io/context.json",
  "@id": "http://wellcomelibrary.org/service/trackingLabels/b16676166",
  "profile": "http://universalviewer.io/tracking-extensions-profile",
  "trackingLabel": "Format: video, Institution: n/a, Identifier: b16676166, Digicode: digfilm, Collection code: n/a"
  },
  "mediaSequences": [
  {
  "@id": "https://wellcomelibrary.org/iiif/b16676166/xsequence/s0",
  "@type": "ixif:MediaSequence",
  "label": "XSequence 0",
  "elements": [
  {
  "@id": "https://dlcs.io/iiif-av/wellcome/1/97a268c6-a212-4f06-81d3-27628e973bfc/full/full/max/max/0/default.mp4#identity",
  "@type": "dctypes:MovingImage",
  "format": "video/mp4",
  "label": "Cruel kindness.",
  "metadata": [
  {
  "label": "length",
  "value": "13mn 4s"
  }
  ],
  "thumbnail": "https://wellcomelibrary.org/posterimages/0055-0000-4078-0000-0-0000-0000-0.jpg",
  "rendering": [
  {
  "@id": "https://dlcs.io/iiif-av/wellcome/1/97a268c6-a212-4f06-81d3-27628e973bfc/full/full/max/max/0/default.mp4",
  "format": "video/mp4"
  },
  {
  "@id": "https://dlcs.io/iiif-av/wellcome/1/97a268c6-a212-4f06-81d3-27628e973bfc/full/full/max/max/0/default.webm",
  "format": "video/webm"
  }
  ],
  "height": 0,
  "width": 0
  }
  ]
  }
  ],
  "sequences": [
  {
  "@id": "https://wellcomelibrary.org/iiif/ixif-message/sequence/seq",
  "@type": "sc:Sequence",
  "label": "Unsupported extension. This manifest is being used as a wrapper for non-IIIF content (e.g., audio, video) and is unfortunately incompatible with IIIF viewers.",
  "compatibilityHint": "displayIfContentUnsupported",
  "canvases": [
  {
  "@id": "https://wellcomelibrary.org/iiif/ixif-message/canvas/c1",
  "@type": "sc:Canvas",
  "label": "Placeholder image",
  "thumbnail": "https://wellcomelibrary.orgplaceholder.jpg",
  "height": 600,
  "width": 600,
  "images": [
  {
  "@id": "https://wellcomelibrary.org/iiif/ixif-message/imageanno/placeholder",
  "@type": "oa:Annotation",
  "motivation": "sc:painting",
  "resource": {
  "@id": "https://wellcomelibrary.org/iiif/ixif-message-0/res/placeholder",
  "@type": "dctypes:Image",
  "height": 600,
  "width": 600
  },
  "on": "https://wellcomelibrary.org/iiif/ixif-message/canvas/c1"
  }
  ]
  }
  ]
  }
  ]
  }

export default videoManifest;
