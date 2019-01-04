# -*- encoding: utf-8
"""
This file contains helpers that are useful in multiple scripts.
"""

import csv
import functools
import gzip
import json
import os

try:
    from urllib.request import urlretrieve
except ImportError:
    from urllib import urlretrieve


SNAPSHOT_URL = "http://data.wellcomecollection.org/catalogue/v2/works.json.gz"
SNAPSHOT_PATH = "works_v2.json.gz"


def save_snapshot():
    urlretrieve(url=SNAPSHOT_URL, filename=SNAPSHOT_PATH)


def requires_snapshot(f):
    """
    This decorator can be applied to a function and ensures that a local snapshot
    is downloaded before the function starts running.

    e.g. get_all_works()

    """
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        if not os.path.exists(SNAPSHOT_PATH):
            save_snapshot()
        return f(*args, **kwargs)

    return wrapper


@requires_snapshot
def get_all_works():
    """Generates every work in the snapshot."""
    for line in gzip.open(SNAPSHOT_PATH):
        yield json.loads(line)


def save_tally_to_path(name, tally, headings):
    path = name + ".csv"

    with open(path, "w") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headings)
        for label, count in tally.most_common():
            if isinstance(label, (str, int)):
                row = [label, count]
            elif isinstance(label, tuple):
                row = list(label) + [count]
            else:
                raise TypeError(
                    "Got %r of type %s; expected str, int or tuple" %
                    (label, type(label))
                )
            writer.writerow(row)

    return path
