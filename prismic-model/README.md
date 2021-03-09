# Content model for Prismic

These are the JSON / js files needed to create custom types in [Prismic](https://prismic.io).

We can create the models in JS to avoid copy / paste errors, and then run:

  yarn convert custom_type
  # e.g.
  yarn convert installations

To eliminate the possibility of overwriting changes to the custom types in Prismic, any changes should be merged to master before starting work on a feature that uses them and you should rerun convert on the master branch to make sure nothing has changed before applying it in Prismic.

N.B. In order for model changes to take effect in prismic, a custom type of the one created/amended needs to be saved.

