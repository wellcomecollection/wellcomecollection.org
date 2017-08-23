const licenseMap = {
  'copyright-not-cleared': {
    text: 'Copyright not cleared'
  },
  'PDM': {
    url: 'https://creativecommons.org/publicdomain/mark/1.0/',
    text: 'Public Domain',
    icons: ['cc_pdm']
  },
  'CC0': {
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    text: 'CC0',
    icons: ['cc_zero']
  },
  'CC-BY': {
    url: 'https://creativecommons.org/licenses/by/4.0/',
    text: 'CC BY',
    icons: ['cc', 'cc_by']
  },
  'CC-BY-NC': {
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
    text: 'CC BY-NC',
    icons: ['cc', 'cc_by', 'cc_nc']
  },
  'CC-BY-NC-ND': {
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    text: 'CC BY-NC-ND',
    icons: ['cc', 'cc_by', 'cc_nc', 'cc_nd']
  }
};

export default function(licenseType) {
  return licenseMap[licenseType];
}
