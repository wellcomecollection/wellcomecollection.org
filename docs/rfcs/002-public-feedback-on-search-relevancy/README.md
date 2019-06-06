# RFC 002: Collecting public feedback

## Background
We have [been collecting feedback on multiple query types](https://github.com/wellcometrust/catalogue/tree/master/docs/search%20relevance)
internally. While this is useful, it makes us hard to make changes at a more
rapid pace with feedback from a wider variety of people.


## Problem statement
The feedback and data that we collect internally is useful, but lacks in
scalability, both in data collection and resource, and representation of the
people who use our service.

It does also lacks in giving us an explicit feedback point into the trust levels
of our relevance.

We would like to find a way to collect feedback on relevancy from the public
more explicitly. Based on the work we have done do far, it would probably be on
a scale of 1-4 (irrelevant -> highly relevant. [More on metric here](https://github.com/wellcometrust/catalogue/tree/master/docs/search%20relevance#metrics).)

At the same time, we would also like to:
* Avoid losing trust by making things worse.
* To be explicit about the testing. This could be through allowing people to
  exit a test, explicitly opt-in, or another mechanism. See some of the example
  solutions below.
* Not clutter the UI for those who aren't interested.


## Proposed solution(s)
There are multiple ways for us to do this, below are some of the solutions that
have been spoken about over the past few months. None of them are exclusive to
each other, and it could be that we land up with a salmagundi of any of them.

The titles of these need work

`n` is generally used for things that are undefined.

### Opt-outable A/B testing
Take `n%` of people using our site, and then split them randomly across the
candidate queries.

Explcitly tell them that we are doing this, and allow opt-out, business as usual
searching.

__Metrics:__ [Implicit](https://github.com/wellcometrust/catalogue/tree/master/docs/search%20relevance#implicit)

### Entry to "help us help you" via `Explore our collections.
Have a component on `Explore our collections` which has a selection of terms
selected by `n`. Explain to people that by using this component, they will then
be shown a relevance rater on the search page to help us make things better.

### Candidate query selector <sup>2000</sup>
Create a more acceptable way of surfacing the candidate queries to people, and
explain to them what they are.

We currently have boost, which boosts certain fields in terms of returning a
relevancy score (we have the explicit amounts for each field),
and [minimum-should-match (MSM)](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-minimum-should-match.html)
and a combination of the two.

Could we find a way to surface this without being to techy.

__Metrics:__ [Explicit](https://github.com/wellcometrust/catalogue/tree/master/docs/search%20relevance#explicit)

### Boosters: Complete control
This is a little more nuanced and needs more work on the API, but has been
spoken about.

The idea is open up more control around MSM and boost queries.

A potential would be to add a slider to each field we select, and potentially
one for MSM, and potentially have presets for specific scenarios (e.g. Find me
a book with this title).

__Metrics:__ [Explicit](https://github.com/wellcometrust/catalogue/tree/master/docs/search%20relevance#explicit)

#### Example
<img width="798" alt="Screenshot 2019-06-05 at 17 01 00" src="https://user-images.githubusercontent.com/31692/58971606-b362c080-87b3-11e9-908a-db3dd3b70632.png" alt="a screenshot of the search boosting complete control" />

[PR](https://github.com/wellcometrust/wellcomecollection.org/pull/4506)
