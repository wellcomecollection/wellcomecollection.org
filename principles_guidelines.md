#Front End Principles and Guidelines

##Intro

This document outlines core concepts that will inform the development of the Wellcome Collection website.

<a name="index"></a>
## Index

- [Progressive Enhancement](#pe) 
- [Mobile First](#mf)
- [Pattern Library](#pl)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Browser/device support](#support)

<a name="pe"></a>
##Progressive Enhancement

[back to top](#index)

**The site will function without JavaScript or CSS**

Progressive enhancement is a way of building websites that ensures it will function with HTML alone.  This adds to the development overhead, but is crucial for ensuring sites are available to the widest possible audience. 

In combination with ['cutting the mustard'](http://responsivenews.co.uk/post/18948466399/cutting-the-mustard), it provides the best strategy for making sites that work on as large a number of devices/browsers as possible.

Opera mini and other [proxy browsers constitute a significant and growing proportion of web browsers](https://www.youtube.com/watch?v=BHO70H9tvqo#t=16m51s) in use. This is particularly true in developing countries where slower network connections and expensive data plans make them appealing.  Using [progressive enhancement is key to making sites that operate well on proxy browsers](https://dev.opera.com/articles/making-sites-work-opera-mini/).


<a name="mf"></a>
##Mobile first

**The site will be designed for smallest screens first**

This is both a design ethos and a technical implementation strategy.

Among other benefits, designing for smaller screens first helps to place focus on the core experience (which feeds into to the 'cutting the mustard' technique alluded to above).

In terms of implementation, it dictates a strategy for the use of media queries.

[back to top](#index)

##Pattern Library

**The site will contain a living pattern library**

All components will be displayed in a pattern library, which shares it's code with the main website, ensuring it stays up to date.

A pattern library will help us to deliver a consistent user experience and promote the reuse of code. It also provides other benefits such as simplifying CSS regression testing.


<a name="performance"></a>
## Performance

[back to top](#index)

**The site will deliver core content as fast as possible**  - (need to determine exactly what this means - working on separate doc)

Performance needs to be a consideration throughout the build and we should always be mindful of limited hardware, poor latency, and low bandwidth situations.

A performance budget should be used against which decesions about design, development, content, or any aspect of a site that may affect performance can be made. 


###Performance budget

- in progress...

<a name="accessibility"></a>
## Accessibility

[back to top](#index)

** The website will conform to WCAG 2.0 - level Double-A **

The aim is to make the website accessible to the widest possible audience, regardless of the technology used to view it or the abilities of users. To this end, we aim to meet at least level Double-A conformance of the [Web Content Accessibility Guidelines (WCAG) 2.0](http://www.w3.org/TR/WCAG20/).

The only exceptions to this will be where compliance is technically unfeasible and practical alternatives can be provided.  

In addition, although reliance on client side scripts are permitted in the guidelines, we will strive to ensure that core functionality and information is available without them, in keeping with the [commitment to progressive enhancement](#pe), outlined above.

<a name="support"></a>
##Browser/device support

[back to top](#index)

**We will manually test the site on the following browsers***

| Browser                                    | Support Level |
|:------------------------------------------:|:-------------:|
| Chrome (latest 2 versions)                 | Full          |
| Safari (latest 2 versions)                 | Full          |
| Firefox (latest 2 versions)                | Full          |
| Edge (latest 2 versions)                   | Full          |
| Internet Explorer (latest 2 versions)      | Full          |
| Opera Mini (extreme mode)                  | Basic         |
| iOS 9+ with Safari and Chrome              | Full          |
| Android 4.4+ with latest version of Chrome | Full          |
| iOS 8 basic                                | Basic         | 

*subject to 6 month review (next review date: 15/03/17)

Support is divided into 2 categories, **_Basic_** and **_Full_**:

<dl>
    <dt>Basic</dt>
    <dl>All content is accessible, but more advanced user interactions will be missing and there may be minor display issues</dl>  
    <dt>Full</dt>
    <dl>All content is accessible and the site is visually and functionally complete</dl>  
</dl>

These lists were determined from amalgamated analytics data for the Wellcome Collection, Wellcome Library and Wellcome Images websites for the 6 months to 15/09/16.

The most popular browsers are added to the list, until they make up approximately 95% of traffic. The browser versions of evergreen browsers, i.e. those that automatically update themselves silently without prompting the user, are combined and the latest stable version and the version immediately before that will be tested.

Opera Mini (in Extreme mode) is also included, as this provides an easy way to test the core experience.  In extreme mode, Opera Mini ignores some CSS, doesn't load web fonts, has a low level of Javascript support and an arbitrary Javascript execution timeout.
