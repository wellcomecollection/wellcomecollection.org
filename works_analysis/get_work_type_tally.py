#!/usr/bin/env python
# -*- encoding: utf-8
"""
This script prints a tally of work types.
"""

import collections

from helpers import get_all_works, save_tally_to_path


if __name__ == '__main__':
    tally = collections.Counter()

    for work in get_all_works():
        work_type = work["workType"]
        tally[(work_type["id"], work_type["label"])] += 1

    path = save_tally_to_path(
        name="work_type_tally",
        tally=tally,
        headings=["work type ID", "work type label", "# of works"]
    )

    print(path)
