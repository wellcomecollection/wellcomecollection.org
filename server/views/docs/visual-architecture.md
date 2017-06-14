---
title: Visual Architecture
---

_Note: The below describes a few ideals that have not yet been implemented, but will give us and
others direction moving forward_.

The architecture we have composed consists of two parts. [Structure](#structure) & [Style](#style).

# Structure

## App shell

The app shell contains parts of the layout that rarely change as the app is used.

This may contain small state changes, such as the selected state of a navigation changing.

The app shell will also have a placeholder for the [page](#page).

The app shell may also contain [layouts](#layout-elements).

[You can read this article for a more detailed description for an app shell model and it's benefits](https://developers.google.com/web/fundamentals/architecture/app-shell).


## Page

The page is the content that is loaded dependant on the route requested by the client.
e.g. `/explore`.

The page can consist of one or more [layouts](#layout-elements).

The page will rarely, if ever, have [style](#style)s.


## Layout elements

A elements are intentionally stupid objects including:

  * Rows: Allows styling of full width
    * Containers: Constrains the contained content to a certain width or behavior.

Layout elements may contain [components](#components), but may not contain themselves.

Layout elements will always manage their own [style](#style), but have access to
[global styles](#global-styles).


## Components

Components are the pieces of the puzzle that make up the great chunk of information within the
application. Components have 2 sub-types:

  * Modules (TODO: Better naming?): These are components that can stand alone without context and
    be useful. e.g. image gallery
  * Atoms: These are the constituent parts of modules. They can be reused within modules, but do not
    make sense without the context of the module.

Components can be children of components, whether it be a module or atom.

Components will always manage their own [style](#style), but have access to
[global styles](#global-styles).

<hr class="divider" />


# Style

## Global style

Globally accessible, reusable styles are defined in
[`_root-scope-classes.scss`](https://github.com/wellcometrust/wellcomecollection.org/blob/master/client/scss/utilities/_root-scope-classes.scss).

## Width

The layout has a maximum width of 1338px.

## Breakpoints

The layout utilises 3 breakpoints:

- Small: >= 0
- Medium: >= 600px
- Large: >= 960px
- XLarge > 1338px

## Grid columns/spacing

The grid consists of 12 columns and breakpoints determine the spacing between the columns,
i.e. gutters, and the space either side of the layout, i.e. margins.

### Small

- Width of gutters: 18px
- Width of margins: 30px

### Medium

- Width of gutters: 24px
- Width of margins: 42px

### Large and Extra large

- Width of gutters: 30px
- Width of margins: 60px
