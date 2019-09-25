const audioManifest = {
  "@context": [
  "http://iiif.io/api/presentation/2/context.json",
  "http://wellcomelibrary.org/ld/ixif/0/context.json"
  ],
  "@id": "https://wellcomelibrary.org/iiif/b17307922/manifest",
  "@type": "sc:Manifest",
  "label": "Florence Nightingale : greetings to the dear old comrades of Balaclava.",
  "metadata": [
  {
  "label": "Title",
  "value": "Florence Nightingale :"
  },
  {
  "label": "Date",
  "value": "1890."
  },
  {
  "label": "Physical Description",
  "value": "1 encoded audio file (01.14 min.) : 44.1kHz"
  },
  {
  "label": "Summary",
  "value": "This short recording was made on 30th July 1890 to raise money for the impoverished veterans of the Charge of the Light Brigade. The full transcript of the recording says: 'When I am no longer even a memory, just a name, I hope my voice may perpetuate the great work of my life. God bless my  dear old comrades of Balaclava and bring them safe to shore. Florence Nightingale.' In fact, there are two recitations; the second has slightly altered wording to the first, which was presumably a practice session."
  },
  {
  "label": "",
  "value": "<a href='https://search.wellcomelibrary.org/iii/encore/record/C__Rb1730792'>View full catalogue record</a>"
  },
  {
  "label": "Full conditions of use",
  "value": "This work has been identified as being free of known restrictions under copyright law, including all related and neighbouring rights and is being made available under the <a target=\"_top\" href=\"http://creativecommons.org/publicdomain/mark/1.0/\">Creative Commons, Public Domain Mark</a>.<br/><br/>You can copy, modify, distribute and perform the work, even for commercial purposes, without asking permission."
  }
  ],
  "license": "https://creativecommons.org/publicdomain/mark/1.0/",
  "logo": "https://wellcomelibrary.org/assets/img/squarelogo64.png",
  "related": {
  "@id": "https://wellcomelibrary.org/item/b17307922",
  "format": "text/html"
  },
  "seeAlso": [
  {
  "@id": "https://wellcomelibrary.org/data/b17307922.json",
  "format": "application/json",
  "profile": "http://wellcomelibrary.org/profiles/res"
  },
  {
  "@id": "https://wellcomelibrary.org/resource/schemaorg/b17307922",
  "format": "application/ld+json",
  "profile": "http://iiif.io/community/profiles/discovery/schema"
  },
  {
  "@id": "https://wellcomelibrary.org/resource/dublincore/b17307922",
  "format": "application/ld+json",
  "profile": "http://iiif.io/community/profiles/discovery/dc"
  }
  ],
  "service": {
  "@context": "http://universalviewer.io/context.json",
  "@id": "http://wellcomelibrary.org/service/trackingLabels/b17307922",
  "profile": "http://universalviewer.io/tracking-extensions-profile",
  "trackingLabel": "Format: audio, Institution: n/a, Identifier: b17307922, Digicode: digaudio, Collection code: n/a"
  },
  "mediaSequences": [
  {
  "@id": "https://wellcomelibrary.org/iiif/b17307922/xsequence/s0",
  "@type": "ixif:MediaSequence",
  "label": "XSequence 0",
  "elements": [
  {
  "@id": "https://dlcs.io/iiif-av/wellcome/1/0128dccf-e2b8-4b0d-b41a-2d9edc6952f5/full/max/default.mp3#identity",
  "@type": "dctypes:Sound",
  "format": "audio/mp3",
  "label": "Florence Nightingale : greetings to the dear old comrades of Balaclava.",
  "metadata": [
  {
  "label": "length",
  "value": "74.057144"
  }
  ],
  "thumbnail": "https://wellcomelibrary.org/posterimages/0056-0000-4402-0102-0-0000-0000-0.jpg",
  "rendering": {
  "@id": "https://dlcs.io/iiif-av/wellcome/1/0128dccf-e2b8-4b0d-b41a-2d9edc6952f5/full/max/default.mp3",
  "format": "audio/mp3"
  }
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

export default audioManifest;
