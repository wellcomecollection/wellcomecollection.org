locals {
  toggles_cookies = ["toggles", "toggle_*"]
  works_cookies   = ["_queryType"]
  userpreference_cookies = ["WC_*"]

  content_query_params = [
    "cachebust",
    "current",
    "page",
    "result",
    "toggle",
    "uri",

    # This is used to fetch articles client-side, e.g. related stories.
    # When it's missing, we may show the wrong stories as "read this next"
    # on articles.
    #
    # See https://github.com/wellcomecollection/wellcomecollection.org/issues/7461
    "params"
  ]

  works_query_params = [
    "_queryType",
    "availabilities",
    "canvas",
    "current",
    "genres.label",
    "items.locations.locationType",
    "languages",
    "manifest",
    "page",
    "query",
    "source",
    "subjects.label",
    "contributors.agent.label",
    "toggle",
    "cachebust",
    "workType",
  ]

  images_query_params = [
    "cachebust",
    "color",
    "locations.license",
    "page",
    "query",
    "source",
    "source.contributors.agent.label",
    "source.genres.label",
    "source.subjects.label",
    "toggle",
  ]

  one_minute = 60
  one_hour   = 60 * local.one_minute
  one_day    = 24 * local.one_hour
  one_year   = 365 * local.one_day
}
