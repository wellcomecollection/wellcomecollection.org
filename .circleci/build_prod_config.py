#!/usr/bin/env python

import json

js_hash = json.load(open('../dist/js-hash.json'))
css_hash = json.load(open('../dist/css-hash.json'))

# Bah, mutations
full_hash = js_hash.copy()
full_hash.update(css_hash)

prodConfigJson = json.dumps({'hashedAssets': full_hash})

with open('../server/config/prod.json', 'w') as prodConfig:
  prodConfig.write(prodConfigJson)
