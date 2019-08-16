# Our beta collections search
Our collections search is currently in beta, which means we’re developing the service in public for our users. It’s a work in progress, and subject to change based on your feedback and testing.

As part of this work, we will bring together library collections, physical and digital alike, into a single place. Here you will be able to search, browse, read and do research across the whole Wellcome library catalogue.

For a more comprehensive search of all of our collections, [wellcomelibrary.org](https://wellcomelibrary.org) is still available. There you can search the library and archive catalogues for complete coverage of the collections and their data.

We will keep this page up to date with the latest information as we make more progress.

## What’s new? (updated 16 August 2019)

### More of the collection available to search
We've made more of our digital collections available. You can now find: 
- 4337 multi-volume works
- 900 digitised videos and 3 audio files [(including an 1890 recording of Florence Nightingale)](https://wellcomecollection.org/works/tp9njewm) under an Audio/Video filter.

### Improvements to search relevance
- The way we score a work's relevance to your search query has changed. We now weigh certain fields more heavily like `title`, `subjects`, `genres`, `description`, and `contributors`. If you are searching for a specific title, this should bring that to the top of the results, but also help for generic searches.

Another way we are trying to bring more relevant results to the top of your search is using a strategy called minimum-should-match. This is where we expect a minimum percentage of your terms to be matched in the result.
  
[You can see the current setup in the code here](https://github.com/wellcometrust/catalogue/blob/d1b4229f6e85c09dd7e5b0c94cffc898d11e23b9/api/api/src/main/scala/uk/ac/wellcome/platform/api/models/WorkQuery.scala#L15-L28), but this will be evolving over time with your feedback. 
  
### Experimental search features
- We've added some experimental parameters to the API, namely `_dateFrom` and `_dateTo`. [An example](https://api-stage.wellcomecollection.org/catalogue/v2/works?_dateFrom=1900-01-01&_dateTo=2000-01-01&query=consumption). We'll be adding some interface elements to this at some stage, and sharing them with you all to get your feedback. So far we have production dates for 64% of our catalogue, and will be adding more soon.

### What are the limits?
* We currently only expose digitised materials, so if you're looking for a physical item from our collections, you can still use the library catalogue on [wellcomelibrary.org](https://wellcomelibrary.org).
*	Some library catalogue data is not available yet, so there may be very little information associated with some images or not be enough information to identify the item you’re looking at.
*	Some images lack references to the item from which they were taken.
*	Our digitised archives and journals are not available yet.
*	No date filtering available yet.

If you want a more comprehensive search, please try searching the catalogue on [wellcomelibrary.org](https://wellcomelibrary.org) in the meantime.

For now, if you need any additional help in identifying items from library collections, please email collections@wellcome.ac.uk.

## What's next:
- We’ll continue to monitor and improve the relevance of your search results. 
- To help you narrow your search results, date filtering will be coming soon. 
- We’re also adding more descriptive data, including physical details, improved date ranges, notes and location information. 


# Get involved
We want to share our work in progress with you, and to get your feedback throughout the development.

If you’d like to help shape how this website works, we invite you to join our User Panel. We’re looking for people at all levels of research experience to participate in the design process.

As a panellist, you’ll be invited to take part in occasional activities which help us test new designs, functionality and features. These activities may be in-person interviews, brief interactive tests, and surveys. You do not need to be present in London to participate; many activities can be done online.

Interested? Please [fill out this form](https://www.surveymonkey.co.uk/r/P6DRMHJ) so we understand more about your interests and can get in touch with you.
