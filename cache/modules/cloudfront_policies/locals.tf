locals {
  toggles_cookies        = ["toggles", "toggle_*"]
  userpreference_cookies = ["WC_*"]
  ga_cookies             = ["_ga"]

  content_query_params = [
    "cachebust",
    "current",
    "page",
    "result",
    "toggle",
    "uri",
    "format",

    # This is used to fetch articles client-side, e.g. related stories.
    # When it's missing, we may show the wrong stories as "read this next"
    # on articles.
    #
    # See https://github.com/wellcomecollection/wellcomecollection.org/issues/7461
    "params"
  ]

  works_query_params = [
    # From /works -> /search/works.
    # This matches the order in redirects.ts
    "query",
    "sort",
    "sortOrder",
    "workType",
    "production.dates.from",
    "production.dates.to",
    "availabilities",
    "subjects.label",
    "genres.label",
    "contributors.agent.label",
    "languages",
    "page",

    # From /works?search=images -> /search/images,
    # previously /works?search=images -> /images.
    # This matches the order in redirects.ts
    "search",
    "images.color",
    "locations.license",
    "source.genres.label",
    "source.subjects.label",
    "source.contributors.agent.label",

    # Individual work page
    "canvas",
    "manifest",

    # All other parameters
    "current",
    "items.locations.locationType",
    "source",
    "toggle",
    "cachebust",
  ]

  images_query_params = [
    # From /images -> /search/images.
    # This matches the order in redirects.ts
    "query",
    "color",
    "locations.license",
    "source.genres.label",
    "source.subjects.label",
    "source.contributors.agent.label",
    "source.production.dates.to",
    "source.production.dates.from",
    "page",

    # All other parameters
    "cachebust",
    "source",
    "toggle",
  ]

  one_minute = 60
  one_hour   = 60 * local.one_minute
  one_day    = 24 * local.one_hour
  one_year   = 365 * local.one_day
}
