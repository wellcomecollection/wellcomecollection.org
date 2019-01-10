# works_analysis

This directory contains some scripts for analysing the types of Work in the Library Collection, to help the Experience team make better product design decisions.

## Usage

These scripts should run in Python 2 or Python 3, including the built-in OS X Python.

The scripts automatically download the data they need.

## Available scripts

*   Get a tally of the number of different work types:

    ```console
    $ python get_work_type_tally.py
    ```

    This produces a CSV `work_type_tally.csv` that tells you how many works there are of each workType.

*   Get a tally of digitised images per work:

    ```console
    $ python get_digitised_images_per_work_tally.py
    ```

    This produces three CSVs:

    -   `digitised_images--any.csv` tells you the number of digitised images per work of *any type*
    -   `digitised_images--image.csv` tells you the number of digitised images per work which have the *iiif-image* location type
    -   `digitised_images--presentation.csv` tells you the number of digitised images per work which have the *iiif-presentation* location type

*   Get a tally of metadata fields per work type:

    ```console
    $ python get_metadata_by_work_type_tally.py
    ```

    This gives you a CSV `metadata_by_work_type.csv` that lets you see how many times a particular metadata field occurs in works of a given work type.
