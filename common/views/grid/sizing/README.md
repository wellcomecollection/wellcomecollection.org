The grid is composed of 12 columns.

Modifier classes can be used to determine exactly how many columns a cell will take up at a given breakpoint.

Size modifier classes take the form `grid__cell--xy`, where `x` is either `s`, `m` or `l` and `y` is the number of columns the cell should span.  Applying a size modifier class to a `grid__cell` div will make the cell span the designated number of columns within the specified breakpoint only.

```html
<div class="grid">
  <div class="grid__cell grid__cell--s6 grid__cell--m3 grid__cell--l4">
    {content goes here}
  </div>
</div>
```

In above example, the first cell will take up half the grid on small screens (6/12),
 a quarter on medium screens (3/12) and a third on large screens (4/12).
