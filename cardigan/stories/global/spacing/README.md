# Spacing

Having a consistent set of spacings between and within components lends a consistent look and feel to the site.

It also enables us to make systematic decisions without being reliant on visual designs any time a new component is created and needs to be placed on a page.

## Section spacing

We define 'Sections' as the top-level elements of the `BasePage`
- `PageHeader`
- `Body`
- `children`
- `Contributors`
- `Siblings`
- `Outro`

Each of these is wrapped in a `<SpacingSection />`, which adds padding at the bottom in order to space them apart.

## Component spacing

Components _within_ these sections are wrapped in a `<SpacingComponent />`. This adds margin to the top to space the components out.

We don't apply this top margin to the first `<SpacingComponent />`, since we don't want to add it to the bottom-margin added by a preceding `<SpacingSection />`.

We handle spacing in body copy and `<SpacingComponent />`s in a similar way*. The main difference being that in body copy we use `em` units.

These are units that are relative to the size of the type, so this enables us to keep the spacing hierarchy consistent when we change the font size (e.g. at different breakpoints) without having to change an absolute pixel value for spacing at the same time.

*: [Axiomatic CSS and Lobotomized Owls](https://alistapart.com/article/axiomatic-css-and-lobotomized-owls)

