# URL Parameters strategy
There are some potential candidates of information you might want to store as
URL parameters.

## Considerations

###  Clarity
The name of the parameter should be clear as to what it is doing.

If you are paginating through a set of results call the parameter `page`, not
`index`.

Interoperability between systems should also be adhered to when possible. If you
are interfacing with an API that uses `query`, you should use `query`, not `q`.


### Privacy and sharing
Is the content in the URL something someone would always want to share?

Does it expose any information that might make it possible for others to assume
intent?

Based on the seventh article of the [Library Bill of Rights](https://en.wikipedia.org/wiki/Library_Bill_of_Rights#cite_note-2)
we should not be leaking information that a person might share in regards to
their research and access to our library unwittingly.

Another consideration is that URLs can be obfuscated by browsers and Operating
systems, people might not see the URL before sharing or citing, you should
always consider:

- Is the content likely to be shared?
- Is the information in the URL something a person would __expect__ to be in the
  URL when shared?

If not, the information should be obfuscated and retrieved via another
mechanism.

#### Do: Expected parameters exposed through the URL
`/works?query=hats`.

Search terms when searching the API.

#### Don't: Unexpected parameters exposed through the URL
`/works/1001?query=hats`.

Exposing the search parameters to be able to render the search for on a work
page. As much as this might be a useful feature, if a person was sharing the
link they might unwittingly share their search parameters too.


### Storing contextual information
We have chosen a strategy that stores the least amount of information
persistently e.g. in a cookie, `localStorage` etc.

We store the information in the application state.

This information is lost whenever a new application state is created.

This could be opening your session in a new tab, refreshing the page, starting
a new browser session, or anything along those lines.

This will not work unless you have JavaScript enabled.
