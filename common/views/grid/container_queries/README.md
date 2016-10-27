Using the cell modifiers, we can reason about what proportion of the screen will be covered at different breakpoints.

Combining the breakpoint and cell modifier information, we can create pseudo *container queries* (also known as *element queries*), enabling components to take on different styles based on their size in the viewport, rather than the size of the viewport itself.

The `container-query()` mixin accepts a size-key ('s', 'm', or 'l') and a number of columns ('1' – '12') as arguments.

These arguments map to the cell modifier strings, and they determine the viewport sizes at which the mixin's `@content` will be rendered in cells with that modifier applied.

## SCSS
```scss
@include container-query('s', '1') {
  background: color('blue');
}

@include container-query('m', '5') {
  background: color('red');
}

@include container-query('l', '3') {
  background: color('charcoal');
}
```
