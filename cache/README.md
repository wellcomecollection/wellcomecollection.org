# Cache

We use CloudFront for the cache of wellcomecollection.org.

## lambda@edge

### [Redirector](./edge_lambdas/src/redirector.test.ts)

Redirects traffic at the edge, mitigating against any latency of having to route to a service.

The list is controlled via [a static map of URLs](./edge_lambdas/src/redirects.ts).

We don't control marketing URLs or alias URLs here. Marketing URLs are generally best handled with a
link shortener for tracking etc. Alias URLs, e.g. `/whats-on` are managed with the
[routing of the relevant application](https://github.com/wellcomecollection/wellcomecollection.org/blob/main/content/webapp/server.ts).

`redirector` runs @ the `origin-request` of [the lambda@edgfe lifecycle](https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html).

### [Toggler](./edge_lambdas/src/toggler.test.ts) (A/B testing)

Randomly assign people into A/B buckets against a `key` that is then available to our webapps.

We do this by setting a `toggle_{key}=true|false` that is then read via the standard toggles method.

![Sequence diagram showing flow of how we assign people into A/B buckets](./lambda-edge-sequence-diagram.png)

-- [Mermaid diagram][lambda-sequence-diagram]

`toggler` runs @ the `origin-request` and `origin-response` of [the lambda@edgfe lifecycle](https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html).

[lambda-sequence-diagram]: (https://mermaid-js.github.io/mermaid-live-editor/edit#eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG5wYXJ0aWNpcGFudCBFbmRfdXNlclxucGFydGljaXBhbnQgQ2xvdWRGcm9udFxucGFydGljaXBhbnQgTGFtYmRhX29yaWdpbl9yZXF1ZXN0XG5wYXJ0aWNpcGFudCBMYW1iZGFfb3JpZ2luX3Jlc3BvbnNlXG5wYXJ0aWNpcGFudCBPcmlnaW5cbkVuZF91c2VyLT4-Q2xvdWRGcm9udDogcmVxdWVzdFxuQ2xvdWRGcm9udC0-PkxhbWJkYV9vcmlnaW5fcmVxdWVzdDogcmVxdWVzdFxuYWx0IGlzIGluIHRlc3RcbiAgICBMYW1iZGFfb3JpZ2luX3JlcXVlc3QtPj5PcmlnaW46IHNlbmQgZGVmYXVsdCBjbGllbnQgY29va2llc1xuZWxzZSBzaG91bGQgYmUgaW4gdGVzdFxuICAgIExhbWJkYV9vcmlnaW5fcmVxdWVzdC0-Pk9yaWdpbjogYXBwZW5kIHRvZ2dsZV94IGNvb2tpZSBoZWFkZXJcbiAgICBMYW1iZGFfb3JpZ2luX3JlcXVlc3QtPj5PcmlnaW46IGFwcGVuZCB4LXRvZ2dsZWQgaGVhZGVyXG5lbmRcbk9yaWdpbi0-PkxhbWJkYV9vcmlnaW5fcmVzcG9uc2U6IHJlc3BvbnNlXG5hbHQgaGFzIHgtdG9nZ2xlZCBoZWFkZXJcbiAgICBMYW1iZGFfb3JpZ2luX3Jlc3BvbnNlLT4-RW5kX3VzZXI6IHNlbmQgU2V0LWNvb2tpZSBoZWFkZXIgdG8geC10b2dnbGVkIFxuZW5kXG4iLCJtZXJtYWlkIjoie1xuICBcInRoZW1lXCI6IFwiZGVmYXVsdFwiXG59IiwidXBkYXRlRWRpdG9yIjpmYWxzZSwiYXV0b1N5bmMiOnRydWUsInVwZGF0ZURpYWdyYW0iOmZhbHNlfQ)