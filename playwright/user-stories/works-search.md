## A user can complete a works search

> As a _researcher_
> I need to _find things I am interested in_
> so I can _use them in my research_

### Scenario 1: The person is looking for an archive
Given we have the archive in our collection
When the person searches for a term matching the archive
    And filters the results for “Archive and manuscripts”
Then the work should be browsable to from the search results

### Scenario 2: The person is searching for a work in the physical library
Given we have a work in the physical library
When the person searches for a term matching that work
    And filters the results by "In the library"
Then the work should be browsable to from the search results

### Scenario 3: The person is searching for a work that is available online
Given we have a work in the physical library
When the person searches for a term matching that work
    And filters the results by "Online"
Then the work should be browsable to from the search results

### Scenario 4: The person is searching for a work from Wellcome Images
Given we have the image in our collection
When the person searches for a term matching that work
    And filters the results by "Digital images"
Then the work should be browsable to from the search results