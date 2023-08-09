import body, { slice } from './body';
import heading from './heading';
import { mediaLink, webLink } from './link';
import keyword from './keyword';
import { multiLineText, singleLineText } from './text';
import gifVideoSlice from './gif-video-slice';
import title from './title';

export default {
  fieldset: 'Body content',
  type: 'Slices',
  config: {
    labels: {
      editorialImage: [
        {
          name: 'featured',
          display: 'Featured',
        },
        {
          name: 'supporting',
          display: 'Supporting',
        },
        {
          name: 'standalone',
          display: 'Standalone',
        },
      ],
      gifVideo: [
        {
          name: 'supporting',
          display: 'Supporting',
        },
      ],
      iframe: [
        {
          name: 'supporting',
          display: 'Supporting',
        },
        {
          name: 'standalone',
          display: 'Standalone',
        },
      ],
      editorialImageGallery: [
        {
          name: 'standalone',
          display: 'Standalone',
        },
        {
          name: 'frames',
          display: 'Frames',
        },
      ],
      quoteV2: [
        {
          name: 'pull',
          display: 'Pull',
        },
        {
          name: 'review',
          display: 'Review',
        },
      ],
    },
    choices: {
      text: {
        type: 'Slice',
        fieldset: 'Text',
        'non-repeat': {
          text: multiLineText('Text', {
            overrideTextOptions: [
              'heading2',
              'heading3',
              'paragraph',
              'strong',
              'em',
              'hyperlink',
              'list-item',
              'embed',
            ],
          }),
        },
      },
      editorialImage: body.config.choices.editorialImage,
      editorialImageGallery: body.config.choices.editorialImageGallery,
      gifVideo: gifVideoSlice(),
      iframe: {
        type: 'Slice',
        fieldset: 'Iframe',
        'non-repeat': {
          iframeSrc: {
            type: 'Text',
            config: {
              label: 'iframe src',
              placeholder: 'iframe src',
            },
          },
          previewImage: {
            type: 'Image',
            config: {
              label: 'Preview image',
            },
          },
        },
      },
      infoBlock: slice('Info block', {
        nonRepeat: {
          title: heading('Title', { level: 2 }),
          text: multiLineText('Text', {
            extraTextOptions: ['heading3', 'list-item'],
          }),
          link: webLink('Button link'),
          linkText: keyword('Button text'),
        },
      }),
      standfirst: {
        type: 'Slice',
        fieldset: 'Standfirst',
        'non-repeat': {
          text: singleLineText('Standfirst', {
            overrideTextOptions: ['strong', 'em', 'hyperlink'],
          }),
        },
      },
      quoteV2: body.config.choices.quote,
      embed: {
        type: 'Slice',
        fieldset: 'Embed',
        'non-repeat': {
          embed: {
            type: 'Embed',
            fieldset: 'Embed',
          },
          caption: singleLineText('Caption', {
            placeholder: 'Caption',
            overrideTextOptions: ['hyperlink', 'em'],
          }),
        },
      },
      discussion: slice('Discussion', {
        nonRepeat: {
          title: heading('Title', { level: 2 }),
          text: multiLineText('Text'),
        },
      }),
      tagList: slice('Tag List', {
        nonRepeat: {
          title: heading('Title', { level: 2 }),
        },
        repeat: {
          link: webLink('Link'),
          linkText: keyword('Link text'),
        },
      }),
      audioPlayer: slice('Audio Player', {
        nonRepeat: {
          title,
          audio: mediaLink('Audio'),
        },
      }),
    },
  },
};
