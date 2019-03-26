# RFC 001: URL strategies

**Last updated: March 2018.**

## Background
URLs are complicated, and you don't often get a chance to do them twice.

They also serve multiple purposes, especially on a client facing app where
state, combinations of data sources and search requirements might not reflect
exactly with corresponding REST APIs.


## Problem statement
We would like to have a list of schemas, policies, processes, and plans that we
could use whenever we think we need to add URLs to our domain.

This may include topics such as
- Structure
- Privacy
- Content this URL is expected to surface

## Proposed solution
We create a policy document on how we deal with creating new, and managing old
URLs and any guiding principles we should follow while doing so.

This could be part process, but also enforced by implementation across the
teams.

### Process
The process has been suggested that we go through using RFCs in adding a new
URL type to our domain, but assumed this could be used for updating them
too.

[An example document has been started here](./example_strategy_document.md).


### Implementation
Implementation can be done through typing, an example for this could be:

```JS
// JS... sorry
type IdentifiedType = {|
  type: 'IdentifiedThing'
  pluralisedName = string,
|}

const Work: IdentifiedType = {
  type: 'IdentifiedThing',
  pluralisedName: 'works',
}

const Authority: IdentifiedType = {
  type: 'IdentifiedThing',
  pluralisedName: 'authorities',
}

function getRouteSchema(thing: IdentifiedThing) {
  if (thing.type === 'IdentifiedThing') {
    return `/${thing.pluralisedName.toLowerCase()}/:id`
  }
}

// Now doing the schema
r.get(getroute(Authority), renderAuthority)
r.get(getroute(Work), renderWork)

```

These could be shared through a cross language code generator, but often the
time involved in this is not worth the effort in small teams.
- [Thrift](https://thrift.apache.org/)
- [gRPC](https://grpc.io)
- [ProtoBuffs](https://developers.google.com/protocol-buffers/)

