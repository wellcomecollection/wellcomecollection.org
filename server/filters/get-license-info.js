const licenseMap = {
  'copyright-not-cleared': {
    text: 'Copyright not cleared',
    humanReadableText: `<p>Copyright for this work has not been cleared. You are responsible for identifying the rights owner to seek permission to use this work.</p>`
  },
  'PDM': {
    url: 'https://creativecommons.org/publicdomain/mark/1.0/',
    text: 'Public Domain',
    icons: ['cc_pdm'],
    humanReadableText: `<p>You can use this work for any purpose without restriction under copyright law.</p><p>Public Domain Mark (PDM) terms and conditions <a href="https://creativecommons.org/publicdomain/mark/1.0">https://creativecommons.org/publicdomain/mark/1.0</a></p>`
  },
  'CC0': {
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    text: 'CC0',
    icons: ['cc_zero'],
    description: 'Free to use for any purpose',
    humanReadableText: `<p>You can use this work for any purpose without restriction under copyright law.</p><p>Creative Commons Zero (CC0) terms and conditions <a href="https://creativecommons.org/publicdomain/zero/1.0">https://creativecommons.org/publicdomain/zero/1.0</a></p>`
  },
  'CC-BY': {
    url: 'https://creativecommons.org/licenses/by/4.0/',
    text: 'CC BY',
    icons: ['cc', 'cc_by'],
    description: 'Free to use with attribution',
    humanReadableText: `<p>You can use this work for any purpose, including commercial uses, without restriction under copyright law. You should also provide attribution to the original work, source and licence.</p><p>Creative Commons Attribution (CC BY 4.0) terms and conditions <a href="https://creativecommons.org/licenses/by/4.0">https://creativecommons.org/licenses/by/4.0</a></p>`
  },
  'CC-BY-NC': {
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
    text: 'CC BY-NC',
    icons: ['cc', 'cc_by', 'cc_nc'],
    description: 'Free to use with attribution for non-commercial purposes',
    humanReadableText: `<p>You can use this work for any purpose, as long as it is not primarily intended for or directed to commercial advantage or monetary compensation. You should also provide attribution to the original work, source and licence.</p>Creative Commons Attribution Non-Commercial (CC BY-NC 4.0)terms and conditions <a href="https://creativecommons.org/licenses/by-nc/4.0">https://creativecommons.org/licenses/by-nc/4.0</a><p>`
  },
  'CC-BY-NC-ND': {
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    text: 'CC BY-NC-ND',
    icons: ['cc', 'cc_by', 'cc_nc', 'cc_nd'],
    description: 'Free to use with attribution for non-commercial purposes. No modifications permitted.'
  }
};

export default function(licenseType) {
  return licenseMap[licenseType];
}
