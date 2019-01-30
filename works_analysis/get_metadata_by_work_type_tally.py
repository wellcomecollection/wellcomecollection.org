#!/usr/bin/env python
# -*- encoding: utf-8

import collections

from helpers import get_all_works, save_rows_to_csv


if __name__ == '__main__':
    tally = collections.defaultdict(lambda: collections.Counter())
    all_fields = set()

    for work in get_all_works():
        for field_name in work.keys():
            all_fields.add(field_name)
            if (work[field_name]):
                tally[work["workType"]["label"]][field_name] += 1

    headings = ["field"] + [k for k in sorted(tally.keys())]

    def rows():
        for field_name in sorted(all_fields):
            if field_name in {"id", "type", "workType"}:
                continue
            yield [field_name] + [
                tally[work_type][field_name]
                for work_type in headings[1:]
            ]

        yield ["TOTAL"] + [tally[work_type]["id"] for work_type in headings[1:]]

    path = save_rows_to_csv(
        name="metadata_by_work_type",
        rows=rows(),
        headings=headings
    )

    print(path)
