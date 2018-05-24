const imgUrl = 'https://iiif.wellcomecollection.org/image/prismic:3b5cbf1ea786f93c3905e048bbbd53948ab9d650_medusa-16x9.jpg/full/full/0/default.jpg';
export const image = {
  contentUrl: imgUrl,
  width: 2438,
  height: 1371,
  alt: 'an image with some alt text',
  tasl: {
    contentUrl: imgUrl,
    title: 'The title of the image',
    author: 'The author',
    sourceName: 'Wellcome Collection',
    sourceLink: 'https://wellcomecollection.org/works',
    license: 'CC-BY-NC'
  }
};

export const text = [
  {
    'type': 'paragraph',
    'text': 'Grills (aka grillz, fronts or golds) are a type of mouth jewellery first worn by hip-hop artists in 1980s America. The removable tooth guards are made from precious metals like platinum and gold and sometimes encrusted with precious gems.',
    'spans': []
  },
  {
    'type': 'paragraph',
    'text': 'Today, grills are an established part of pop culture. The singer Nelly wrote a song about them in 2005, and they’ve adorned the teeth of celebrities such as Madonna, Beyoncé and Katy Perry. ',
    'spans': [
      {
        'start': 65,
        'end': 94,
        'type': 'hyperlink',
        'data': {
          'link_type': 'Web',
          'url': 'https://www.youtube.com/watch?v=8fijggq5R6w'
        }
      },
      {
        'start': 177,
        'end': 188,
        'type': 'hyperlink',
        'data': {
          'link_type': 'Web',
          'url': 'http://www.guinnessworldrecords.com/news/2018/2/million-dollar-teeth-grill-worn-by-katy-perry-is-confirmed-as-most-valuable-ever-512299'
        }
      }
    ]
  },
  {
    'type': 'paragraph',
    'text': 'Grills range in style from full mouthpieces, covering every tooth in shining metal, to simple metal shapes that subtly enhance the teeth.',
    'spans': []
  },
  {
    'type': 'paragraph',
    'text': 'Solange Garcia is a tooth jeweller. In this video, she reveals how bespoke grills are made.  It’s a skilled process that draws on dentistry techniques such as casting an impression of the client’s teeth. And that seems appropriate because you probably need strong teeth to wear a grill.',
    'spans': []
  }
];

export const videoEmbed = { embedUrl: 'https://www.youtube.com/embed/VYOjWnS4cMY' };
