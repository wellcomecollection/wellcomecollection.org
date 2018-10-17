## Captioned image heights
Captioned images should go as wide as they can within their container, but no taller than 80% of the viewport height.

They will retain their aspect ratio and they will be centered (using JavaScript) within their container.

For example, a portrait image in a 12 column container will _try_ to go as wide as it can, but will likely be limited by the fact that were it to be 12 columns wide, it would end up taller than the viewport.

In order to ensure that images retain their aspect ratio while not growing larger than the viewport, they necessarily have their `width` property set to `auto` (rather than our default for images, which is `100%`). This necessitates that the image is _at least_ as wide as the area that it needs to fill.

This shouldn't be a problem in terms of content creation (we upload larger-than-necessary resize multiple responsive widths on the server) but it does mean careful attention should be paid to the `sizes` attribute that determines which responsive image is most appropriate for the browser to serve at various breakpoints.
