## A researcher can view items on a work in our catalogue

> As a _researcher_
> I want to _explore the facets of a work's item_
> so I can _evaluate if it is relevant to my research_

### Scenario 1: A user wants a large-scale view of an item
Given A user wants a large-scale view of an item
When they are on an item page
Then they are able to change the scale of the image

### Scenario 2: A user wants to use the content offline
Given a user wants to use the content offline
When they are on an item page
Then they are able to download a copy of the item

### Scenario 3: A user wants information about the item they are viewing
Given a user wants information about an item
When they are on the item's page
Then they are able to access relevant information about the item

### Scenario 4: A user wants to know how they can make use of an item
Given a user wants to know how they can make use of an item
When they are on the item's page
Then they are able to find relevant license information about the item

### Scenario 5: A user wants to view an item in a different orientation
Given a user wants to view an item in a different orientation
When they are on the item's page
Then they are able to rotate the images

### Scenario 6: Item has multiple volumes
Given there are multiple volumes in an item
When the researcher views the item
Then the volumes should be browsable

### Scenario 7: A user wants to navigate an item by its parts
Given an item has structured contents
When the user views the item
Then the structured contents will be browsable

### Scenario 8: A user wants to be able to see all the images for an item
Given a user is viewing an item with multiple canvases
Then they are able to view all of the canvases

### Scenario 9: A user wants to be able to search inside an item's text
Given a user is viewing an item with a related search service
Then the user should be able to conduct a search
And view the results
