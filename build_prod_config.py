#!/usr/bin/env python

import json

# I've left this file here as it feels like it would make mor sense from a
# "Where did those overrides come from", rather than a code hygiene POV
prod_overrides = json.load(open('./server/config/prod-overrides.json'))
js_hash = json.load(open('./dist/js-hash.json'))
css_hash = json.load(open('./dist/css-hash.json'))

# Bah, mutations
full_hash = js_hash.copy()
full_hash.update(css_hash)
prod_overrides.update({'hashedFiles': full_hash})

prod_config_json = json.dumps(prod_overrides)

with open('./server/config/overrides.json', 'w') as prodConfig:
  prodConfig.write(prod_config_json)
