# URL Parameters strategy
There are some potential candidates of information you might want to store as
URL parameters.

## Considerations

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

An example of something a person would expect to be in the URL which also gives
insight into the person's research would be the search terms when searching the
API.

e.g. `/works?query=hats`.

An example of where parameters are useful for application state, not integral to
the rendering of the core content on the page, and thus could not be expected by
a person to be in the URL is to have that context stored to be able to go back
to their search from a result page.

e.g. `/works/1001?query=hats`.
