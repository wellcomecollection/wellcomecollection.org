## A image researcher can complete a works search

> As a _image researcher_
> I want to _find things I am interested in_
> so I can _use them in my research_

### Scenario 1: The person is looking for an archive
Given we have the archive in our collection
When the person searches for a term matching the archive
    And filters the results for “Archive and manuscripts”
Then the work should be browsable to from the search results
