# Wellcome Collection - Prismic

## Adding an exhibition guide

To create an exhibition guide on Prismic you'll need to create a new document from the 'Documents' menu. In the 'Write Something' dropdown, select the `Exhibition guide` type.
You should now get a document like this:

<img width="1429" alt="Screenshot 2022-08-03 at 11 30 45" src="https://user-images.githubusercontent.com/16557524/182593980-b33a2f06-ac50-431d-9ca6-b406dade653e.png">

You'll notice there are two tabs, 'Guide' and 'Components'. In the Guide tab you can give the exhibition guide a title. You should also link the guide to the related exhibition the guide is for.
This means the exhibition will need to be created as a Prismic document before you can link it to the guide.

At this point it is worth mentioning that, **when published**, this guide will appear on weco.org at
`http://www..wellcomecollection.org/guides/exhibitions`. At the moment, that looks like this:

<img width="1220" alt="Screenshot 2022-08-03 at 11 36 48" src="https://user-images.githubusercontent.com/16557524/182593974-89e4e7ae-3a6f-43cc-9ad2-3c3add8a0954.png">

The exhibition guide card will show the promo image for the exhibition (pulled from the related exhibition), the title of the exhibition guide and the description for the exhibition (pulled from the related exhibition). Behind the scenes the Prismic data is fetched, transformed and rendered on the website for each exhibition guide split into the four guide formats (with audio descriptions, without audio descriptions, captions and transcripts and BSL videos).

## Adding components to your exhibition guide (i.e. stops, sections, subsections)

In Prismic, within your newly created exhibition guide, go to the components tab. Here you will see you have the option to add 'Guide Components'. You can add all the information for a component, or stop, in each repeatable component.
You can now add all the data including: Position Number (though we may change how this works as not all stops/sections/subsections have numbers), Title, Tombstone, Description, Audio with description, Audio without description, Embed(Youtube) (for BSL Video), Caption, Transcript.

### Uploading Audio with description and Audio without description

You can link to audio content you have uploaded to the Prismic Media Library. We recommend that when uploading exhibition guide audio that you name files in the following format, to make searching for the link easier within each exhibition guide document on Prismic.

`ExhibitionTitleHere_AudioWithDescription_stoptitle_stopnumber`

for example:

`RootedBeings_AudioWithDescription_test_001`


When published this shows up for this exhibition guide at `https://www.wellcomecollection.org/guides/exhibitions/THEIDOFYOURPRISMICDOC`, that looks like the below screenshot. Clicking any one of the four guide types will open a page showing only that content for each stop.

<img width="1220" alt="Screenshot 2022-08-03 at 12 05 07" src="https://user-images.githubusercontent.com/16557524/182593967-8ad625cc-1982-464d-a545-5af2700104db.png">

For example, the stops for audio without descriptions would be at `https://www.wellcomecollection.org/guides/exhibitions/THEIDOFYOURPRISMICDOC/audio-without-descriptions`.
