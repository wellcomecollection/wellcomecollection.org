#!/usr/bin/env python

import json

with open('../dist/js-hash.json', 'r') as js_hash_file, open('../dist/css-hash.json', 'r') as css_hash_file:
    js_hash = json.load(js_hash_file)
    css_hash = json.load(css_hash_file)

    # Bah, mutations
    full_hash = js_hash.copy()
    full_hash.update(css_hash)

    prodConfigJson = (json.dumps({'hashedAssets': full_hash}))
    prodConfig = open('../server/config/prod.json', 'w')
    prodConfig.write(prodConfigJson)
    prodConfig.close()

