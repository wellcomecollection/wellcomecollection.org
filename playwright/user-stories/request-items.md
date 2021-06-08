## A researcher can request physical items so that they can view them in the library.

> As a _researcher_
> I want to _request a physical item_
> so that I can _view it in the library as part of my research_

### Scenario 1: researcher is logged out
Given the researcher is logged out
When they they view a work with requestable items
Then they will see a link to a login/register page

### Scenario 2: researcher is not a library member
Given the researcher is on the login/register page
Then they will find information on joining the library
And they will be able to register for a library account

### Scenario 3: researcher is a library member
Given the researcher is on the login/register page
Then they will be able to sign in to their account

### Scenario 4: researcher is logged in
Given the researcher is logged in
When they are viewing a work with requestable items
Then they will be able to request each requestable item

### Scenario 5: researcher initiates item request
Given the reseracher initiates an item request
Then they will see information about how many more items they can request

### Scenario 6: researcher confirms item request
Given the researcher confirms an item requst
Then they will see information about the process for viewing the item
And they will see information about any possible delays before the item is available to pick up
