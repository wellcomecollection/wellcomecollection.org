#!/usr/bin/env python
# -*- encoding: utf-8
"""
This script downloads the latest version of a V2 works snapshot.
"""

try:
    from urllib.request import urlretrieve
except ImportError:
    from urllib import urlretrieve


if __name__ == '__main__':
    urlretrieve(
        "http://data.wellcomecollection.org/catalogue/v2/works.json.gz",
        "works_v2.json.gz"
    )
