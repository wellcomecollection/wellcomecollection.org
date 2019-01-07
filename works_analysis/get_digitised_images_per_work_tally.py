#!/usr/bin/env python
# -*- encoding: utf-8

import collections

from helpers import get_all_works, save_tally_to_path


if __name__ == '__main__':
    tally_image = collections.Counter()
    tally_presentation = collections.Counter()
    tally_any = collections.Counter()

    for work in get_all_works():
        for it in work["items"]:
            digital_locations = [
                loc
                for loc in it["locations"]
                if loc["type"] == "DigitalLocation"
            ]

            tally_any[len(digital_locations)] += 1

            iiif_image = [
                loc
                for loc in digital_locations
                if loc["locationType"]["id"] == "iiif-image"
            ]

            tally_image[len(iiif_image)] += 1

            iiif_presentation = [
                loc
                for loc in digital_locations
                if loc["locationType"]["id"] == "iiif-presentation"
            ]

            tally_presentation[len(iiif_presentation)] += 1

    save_tally_to_path(
        name="digitised_images--any",
        tally=tally_any,
        headings=["# of digitised images", "# of works"]
    )

    save_tally_to_path(
        name="digitised_images--iiif-image",
        tally=tally_image,
        headings=["# of iiif-image items", "# of works"]
    )

    save_tally_to_path(
        name="digitised_images--iiif-presentation",
        tally=tally_presentation,
        headings=["# of iiif-presentation items", "# of works"]
    )
