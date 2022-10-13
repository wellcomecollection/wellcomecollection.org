# User preferences and redirects

We offer multiple types of exhibition guide (e.g. audio with description, BSL described, captions and transcripts).
When a user opens an exhibition guide on their smartphone, they can choose which guide to read.

To avoid somebody having to repeatedly select the same exhibition guide, we "remember" which guide they select and take them there automatically.

## In-gallery QR codes

We expect in-gallery QR codes to:

*   Link to the audio-without-descriptions guide.
    We believe this is the best default choice.

*   Include a query parameter `usingQRCode=true`, so we can tell somebody has come from scanning an in-gallery code.

*   Include the ID of the stop as both a fragment `#stop` and a query parameter `stopId={stop}`.

For example, 

```
/guides/exhibitions/YzwsAREAAHylrxau/audio-without-descriptions?usingQRCode=true&stopId=witness#witness
```
