# URL strategy
TBD

## Identifiers
TBD

## Parameters
There are some potential candidates of information you might want to store as
URL parameters. Our categorisations, and whether we advocate storing them in
the URL are:

### Do: Application state
This is needed to render your application in a certain state, and is integral to
the functionality of this part of the application.

Generally this will be to search and filter lists.

#### Examples
- Pagination on list of data
- Search queries and filters on a searchable set of data

#### Sharing and privacy
Someone using our site should __expect__ these to be in the URL as it is
integral to what they are sharing.


### Don't: Individual contextual state
This is information that allows for a person to have an easier, more pleasant,
and efficient experience on our site, but might give information that could be
interpreted for intent.

#### Examples
- A person's search across multiple pages
- A person's language choice

#### Sharing and privacy
Someone using the site __might not expect__ these to be in the URL, as it is not
directly related to the content they are sharing.

This is doubly dangerous as not all ways of sharing make the URL editable, or
even visible to a person before sharing or citing.
