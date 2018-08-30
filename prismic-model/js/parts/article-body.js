// @flow
export default {
  'fieldset': 'Body content',
  'type': 'Slices',
  'config': {
    'labels': {
      'editorialImage': [ {
        'name': 'featured',
        'display': 'Featured'
      }, {
        'name': 'supporting',
        'display': 'Supporting'
      }, {
        'name': 'standalone',
        'display': 'Standalone'
      } ],
      'gifVideo': [ {
        'name': 'supporting',
        'display': 'Supporting'
      } ],
      'iframe': [ {
        'name': 'supporting',
        'display': 'Supporting'
      }, {
        'name': 'standalone',
        'display': 'Standalone'
      } ],
      'vimeoVideoEmbed': [ {
        'name': 'featured',
        'display': 'Featured'
      }, {
        'name': 'supporting',
        'display': 'Supporting'
      }, {
        'name': 'standalone',
        'display': 'Standalone'
      } ],
      'youtubeVideoEmbed': [ {
        'name': 'featured',
        'display': 'Featured'
      }, {
        'name': 'supporting',
        'display': 'Supporting'
      }, {
        'name': 'standalone',
        'display': 'Standalone'
      } ]
    },
    'choices': {
      'text': {
        'type': 'Slice',
        'fieldset': 'Text',
        'non-repeat': {
          'text': {
            'type': 'StructuredText',
            'config': {
              'label': 'Text',
              'multi': 'heading2,heading3,paragraph,strong,em,hyperlink,strike,list-item,embed'
            }
          }
        }
      },
      'editorialImage': {
        'type': 'Slice',
        'fieldset': 'Editorial image',
        'non-repeat': {
          'caption': {
            'type': 'StructuredText',
            'config': {
              'single': 'hyperlink, bold, em',
              'label': 'Caption'
            }
          },
          'image': {
            'type': 'Image',
            'config': {
              'label': 'Image'
            }
          }
        }
      },
      'editorialImageGallery': {
        'type': 'Slice',
        'fieldset': 'Editorial image gallery',
        'non-repeat': {
          'title': {
            'type': 'StructuredText',
            'config': {
              'label': 'title',
              'single': 'heading1'
            }
          }
        },
        'repeat': {
          'caption': {
            'type': 'StructuredText',
            'config': {
              'label': 'Caption',
              'single': 'hyperlink, bold, em'
            }
          },
          'image': {
            'type': 'Image',
            'config': {
              'label': 'Image'
            }
          }
        }
      },
      'gifVideo': {
        'type': 'Slice',
        'fieldset': 'Gif video',
        'non-repeat': {
          'caption': {
            'type': 'StructuredText',
            'config': {
              'single': 'hyperlink, bold, em',
              'label': 'Caption'
            }
          },
          'tasl': {
            'type': 'Text',
            'config': {
              'label': 'TASL',
              'placeholder': 'title|author|sourceName|sourceLink|license|copyrightHolder|copyrightLink'
            }
          },
          'video': {
            'type': 'Link',
            'config': {
              'select': 'media',
              'label': 'Video',
              'placeholder': 'Video'
            }
          },
          'playbackRate': {
            'type': 'Select',
            'config': {
              'options': [ '0.1', '0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2' ],
              'label': 'Playback rate'
            }
          }
        }
      },
      'iframe': {
        'type': 'Slice',
        'fieldset': 'Iframe',
        'non-repeat': {
          'iframeSrc': {
            'type': 'Text',
            'config': {
              'label': 'iframe src',
              'placeholder': 'iframe src'
            }
          },
          'previewImage': {
            'type': 'Image',
            'config': {
              'label': 'Preview image'
            }
          }
        }
      },
      'standfirst': {
        'type': 'Slice',
        'fieldset': 'Standfirst',
        'non-repeat': {
          'text': {
            'type': 'StructuredText',
            'config': {
              'single': 'strong, em, hyperlink',
              'label': 'Standfirst'
            }
          }
        }
      },
      'imageList': {
        'type': 'Slice',
        'fieldset': 'Image list',
        'non-repeat': {
          'listStyle': {
            'type': 'Select',
            'config': {
              'options': [ 'numeric' ],
              'label': 'List style'
            }
          },
          'description': {
            'type': 'StructuredText',
            'config': {
              'multi': 'paragraph, hyperlink, bold, em',
              'label': 'Description'
            }
          }
        },
        'repeat': {
          'title': {
            'type': 'StructuredText',
            'config': {
              'label': 'Title',
              'single': 'heading1'
            }
          },
          'subtitle': {
            'type': 'StructuredText',
            'config': {
              'single': 'heading2',
              'label': 'Subtitle'
            }
          },
          'image': {
            'type': 'Image',
            'config': {
              'label': 'Image'
            }
          },
          'caption': {
            'type': 'StructuredText',
            'config': {
              'label': 'Caption',
              'single': 'strong, em, hyperlink'
            }
          },
          'description': {
            'type': 'StructuredText',
            'config': {
              'label': 'Description',
              'multi': 'paragraph, hyperlink, bold, em'
            }
          }
        }
      },
      'quote': {
        'type': 'Slice',
        'fieldset': 'Quote',
        'non-repeat': {
          'quote': {
            'type': 'StructuredText',
            'config': {
              'label': 'Quote',
              'multi': 'hyperlink, bold, em'
            }
          },
          'source': {
            'type': 'Text',
            'config': {
              'label': 'Source'
            }
          },
          'citation': {
            'type': 'Text',
            'config': {
              'label': 'Citation'
            }
          },
          'citationLink': {
            'type': 'Link',
            'config': {
              'select': 'web',
              'label': 'Citation link'
            }
          }
        }
      },
      'excerpt': {
        'type': 'Slice',
        'fieldset': 'Excerpt',
        'non-repeat': {
          'title': {
            'type': 'StructuredText',
            'config': {
              'single': ' ',
              'label': 'Title'
            }
          },
          'content': {
            'type': 'StructuredText',
            'config': {
              'multi': 'paragraph, heading2, hyperlink, strong, em, preformatted',
              'label': 'Content'
            }
          },
          'source': {
            'type': 'Link',
            'config': {
              'label': 'Source',
              'select': 'document',
              'customtypes': [ 'books' ],
              'placeholder': 'Choose a book…'
            }
          },
          'audio': {
            'type': 'Link',
            'config': {
              'select': 'media',
              'label': 'Audio content'
            }
          }
        }
      },
      'embed': {
        'type': 'Slice',
        'fieldset': 'Embed',
        'non-repeat': {
          'embed': {
            'type': 'Embed',
            'fieldset': 'Embed'
          }
        }
      },
      'soundcloudEmbed': {
        'type': 'Slice',
        'fieldset': 'SoundCloud embed',
        'non-repeat': {
          'iframeSrc': {
            'type': 'Text',
            'config': {
              'label': 'iframe src'
            }
          }
        }
      },
      'youtubeVideoEmbed': {
        'type': 'Slice',
        'fieldset': 'YouTube video',
        'non-repeat': {
          'embed': {
            'type': 'Embed',
            'fieldset': 'YouTube embed'
          },
          'caption': {
            'type': 'StructuredText',
            'config': {
              'label': 'Caption',
              'single': 'hyperlink, bold, em',
              'placeholder': 'Caption'
            }
          }
        }
      },
      'vimeoVideoEmbed': {
        'type': 'Slice',
        'fieldset': 'Vimeo video',
        'non-repeat': {
          'embed': {
            'type': 'Embed',
            'fieldset': 'Vimeo embed'
          }
        }
      },
      'instagramEmbed': {
        'type': 'Slice',
        'fieldset': 'Instagram embed',
        'non-repeat': {
          'embed': {
            'type': 'Embed',
            'fieldset': 'Instagram embed'
          }
        }
      },
      'twitterEmbed': {
        'type': 'Slice',
        'fieldset': 'Twitter embed',
        'non-repeat': {
          'embed': {
            'type': 'Embed',
            'fieldset': 'Twitter embed'
          }
        }
      }
    }
  }
};
