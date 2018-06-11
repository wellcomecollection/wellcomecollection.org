# Principles

This document outlines core concepts that will inform the development of the Wellcome Collection website.

## Index

- Progressive enhancement
- Mobile first
- Design system
- Performance
- Accessibility
- Browser/Device Support

## Progressive enhancement

**The site will function without JavaScript or CSS**

Progressive enhancement is a way of building websites that ensures it will function with HTML alone. This adds to the development overhead, but is crucial for ensuring sites are available to the widest possible audience. It provides the best strategy for making sites that work on as large a number of devices/browsers as possible.

Opera mini and other proxy browsers constitute a significant and growing proportion of web browsers in use. This is particularly true in developing countries where slower network connections and expensive data plans make them appealing. Using progressive enhancement is key to making sites that operate well on proxy browsers.

## Mobile first

**The site will be designed for smallest screens first**

This is both a design ethos and a technical implementation strategy.

Among other benefits, designing for smaller screens first helps to place focus on the core experience.

In terms of implementation, it dictates a strategy for the use of media queries.

## Design system

**The site will contain a living design system**

All components will be displayed in a design system, which shares it’s code with the main website, ensuring it stays up to date.

A design system will help us to deliver a consistent user experience and promote the reuse of code. It also serves as a reference point for team members and a useful onboarding tool.

## Performance

**The site will deliver core content as fast as possible**

Performance needs to be a consideration throughout the build and we should always be mindful of limited hardware, poor latency, and low bandwidth situations.

A performance budget should be used against which decesions about design, development, content, or any aspect of a site that may affect performance can be made.

## Accessibility

**The website will conform to WCAG 2.1 - level Double-A**

The aim is to make the website accessible to the widest possible audience, regardless of the technology used to view it or the abilities of users. To this end, we aim to meet at least level Double-A conformance of the Web Content Accessibility Guidelines (WCAG) 2.1.

The only exceptions to this will be where compliance is technically unfeasible and practical alternatives can be provided.

In addition, although reliance on client side scripts are permitted in the guidelines, we will strive to ensure that core functionality and information is available without them, in keeping with the commitment to progressive enhancement, outlined above.

## Browser/Device Support

**We will manually test the site on the following browsers**

| Browser | Support Level |
|:---------|:---------------|
|Chrome (latest 2 versions) | Full |
|Safari (latest 2 versions) | Full |
|Firefox (latest 2 versions) | Full |
|Edge (latest 2 versions) | Full |
|Internet Explorer (latest 2 versions) | Full |
|Opera Mini (extreme mode) | Basic |
|iOS 9+ with Safari and Chrome | Full |
|Android 4.4+ with latest version of Chrome | Full |
|iOS 8 basic | Full |

Support is divided into 2 categories, Basic and Full.

**Basic**
All content is accessible, but more advanced user interactions will be missing and there may be minor display issues.

**Full**
All content is accessible and the site is visually and functionally complete.

The most popular browsers are added to the list, until they make up approximately 95% of traffic. The browser versions of evergreen browsers, i.e. those that automatically update themselves silently without prompting the user, are combined and the latest stable version and the version immediately before that will be tested.

Opera Mini (in Extreme mode) is also included, as this provides an easy way to test the core experience. In extreme mode, Opera Mini ignores some CSS, doesn't load web fonts, has a low level of Javascript support and an arbitrary Javascript execution timeout.
