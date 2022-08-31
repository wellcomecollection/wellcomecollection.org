# server-data

This module fetches data from remote sources that:
 
- we need on every request/page
- doesn't change very often
 
This includes default toggle values, our opening hours, and the global alert banner.

Rather than fetching it on every request, it gets fetched on an interval and cached.
