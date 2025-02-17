## A site user can perform a search

> As a _site user_
> I want to _find things on the site_
> so I can _visit, research, or explore_

### Scenario 1: The person is looking for venue opening times
Given a user enters 'opening times' in the search box
When they arrive on the results page
Then a link to the venue opening times page should be visible
  And pagination should be visible

### Scenario 2: The person searches for a visual story
Given a user enters 'visual story' in the search box
When they arrive on the results page
Then a link to a visual story page should be visible

### Scenario 3: The person is searching for an event
Given a user enters 'Patterns of Life event' in the search box
When they arrive on the results page
Then a link to the event page should be visible
  And the date and time should be visible

### Scenario 4: The person is searching for an exhibition
Given a user enters 'Being human' in the search box
When they arrive on the results page
Then a link to the exhibition page should be visible
  And the date and time should be visible

### Scenario 5: The person is searching for an image
Given a user enters 'egg' in the search box
When they arrive on the results page
Then an 'Image results' section should be visible containing 7 images
  And a link to 'All images' should be visible

### Scenario 6: The person is searching for a work from the catalogue
Given a user enters 'egg' in the search box
When they arrive on the results page
Then a 'Catalogue results' section should be visible containing 6 aggregation buttons
  And a link to 'All catalogue results' should be visible

### Scenario 7: The person's search yields catalogue results but no content results
Given a user enters 'grouse' in the search box
When they arrive on the results page
Then a 'Catalogue results' section should be full width

### Scenario 8: The person' search yields no results at all
Given a user enters 'bananana' in the search box
When they arrive on the results page
Then a no results message should be visible

### Scenario 9: The person is searching for a book
Given a user enters 'anger to wanderlust' in the search box
When they arrive on the results page
There should be a link to a book result
  And the author's name should be visible
