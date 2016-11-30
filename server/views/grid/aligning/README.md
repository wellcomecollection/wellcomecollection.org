Applying a class of either `grid--start`, `grid--center` or `grid--end` to the containing `grid` div will determine how grid cells are aligned horizontally.

Applying a class of `grid--spaced` to the containing `grid` element will space out its child `grid__cell`s (useful for when e.g. there is an empty column of space between to content columns, rather than having to include an empty element for spacing).

Applying a class of `grid__cell--shift-{viewport}{columns}` adds left margin of `{columns}` width to the given cell at the `{viewport}` breakpoint.
