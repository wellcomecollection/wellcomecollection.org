## A researcher can view items on a work in our catalogue

> As a _researcher_
> I want to _explore the facets of an work's item_
> so I can _evaluate if it is relevant to my research_

### Scenario 1: Item has multiple volumes
Given there are multiple volumes in an item
When the researcher views the item
Then the volumes should be browsable

Title: A user I can view an item page

As a researcher
I need to evaluate things I am interested in
so that I can determine whether they are relevant to my research

Scenario 1: A user is viewing a digitised item (with a iiif-presentation location)

Given a user is viewing a digitised book
Then that page will be a valid Item page
And that page will include:
The title of the work
The contributors of the work
The date of the work
License and credit information
Full screen button
Downloads
Deep zoom controls
Image rotation control

Scenario 2: A user is viewing a digitised image (with a iiif-image location)

Given a user is viewing an image
Then that page will be a valid Item page
And that page will include:
The title of the work
The contributors of the work
The date of the work
License and credit information
Full screen button
Downloads
Deep zoom controls
Image rotation control

Scenario 3: A user viewing a digitised item with structured contents

Given a user is viewing a digitised item with structured contents
Then the structured contents will be available

Given a user clicks on a structured content link
Then the associated canvas will be displayed

Scenario 4: A user is viewing a digitised item with multiple parts (e.g. volumes)

Given a user is viewing a digitised item with multiple parts (e.g. volumes)
Then the multiple parts will be available
Given a user clicks on a part link
The associated item will be displayed

Scenario 5: A user is viewing an item with multiple canvases

Given a user is viewing an item with multiple canvases
And the user scrolls then main viewing area
Then the url updates
And the selected page updates
And the visible canvas index matches the selected page

Scenario 6: A user is viewing an item with a related search service

Given a user is viewing an item with a related search service
Then the search form should be available

Given a user searches for a term
Then results should be displayed
And highlights should be displayed on canvases
Given a user clicks a search result
Then the associated canvas will be displayed
