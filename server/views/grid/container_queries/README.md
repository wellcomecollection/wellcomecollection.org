Using the cell modifiers, we can reason about what proportion of the screen will be covered at different breakpoints.

Combining the breakpoint and cell modifier information, we can create pseudo *container queries* (also known as *element queries*), enabling components to take on different styles based on their size in the viewport, rather than the size of the viewport itself.

The `container-query()` mixin accepts a list of lists. The key to each inner list is the breakpoint at which the query will be applied _if_ the cell covers any of the number of columns specified.

For example:

```scss
container-query(('s': ('1', '2'), 'm': ('4'), 'l': ('8', '12'))) {
  // styles here will be applied when the component lives inside one of:
  // grid__cell--s1, grid__cell--s2 and the viewport is  0px – 599px wide
  // grid__cell--m4 and the viewport is 600px - 959px wide
  // grid__cell--l8 or grid__cell--l12 and the viewport is > 960px wide
}
```

## SCSS in the example on this page
```scss
@include container-query(('s': ('1'))) {
  background: color('red-graphics');
}

@include container-query(('m': ('5'))) {
  background: color('orange-graphics');
}

@include container-query(('l': ('3'))) {
  background: color('yellow');
}
```
