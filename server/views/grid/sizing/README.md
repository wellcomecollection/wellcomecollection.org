Modifier classes can be used to determine exactly how many columns a cell will take up at a given breakpoint.

<small>__N.B. remember that there are different numbers of columns avaliable at each breakpoint:
<br>small(s) - 4; medium(m) - 8; large(l) - 12. [See layout documentation for details](/docs/layout).__</small>

Size modifier classes take the form `grid__cell--xy`, where `x` is either `s`, `m` or `l` and `y` is each number of the number of columns the cell should span, in order. Applying a size modifier class to a `grid__cell` div will make the cell span the designated number of columns within the specified breakpoint only.

```html
<div class="grid">
  <div class="grid__cell grid__cell--s12 grid__cell--m12 grid__cell--l1234">
    {content goes here}
  </div>
</div>
```

In above example, the first cell will take up half the grid on small screens (2/4),
 a quarter on medium screens (2/8) and a a third on large screens (4/12).
