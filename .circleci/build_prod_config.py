#!/usr/bin/env python

import json

with open('../dist/assets/js-hash.json', 'r') as js_hash_file:
    js_hash = json.load(js_hash_file)
    prodConfigJson = (json.dumps({'hashedAssets': js_hash}))
    prodConfig = open('../server/config/prod.json', 'w')
    prodConfig.write(prodConfigJson)
    prodConfig.close()

