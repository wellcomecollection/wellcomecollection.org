## Exhibition header

This component comprises a `picture` element and a `HeaderText` component.

The picture will render a square crop on viewports narrower than 600px, and the 'thin' (32:15) crop thereafter.

The picture is capped at 1450px wide (so as to prevent it growing too tall).

The `WobblyEdge` appears overlays the bottom of the picture, but sticks to the bottom of the screen if the viewport isn't high enough to display the entire image.
