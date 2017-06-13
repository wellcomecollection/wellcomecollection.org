export const name = 'instagram-thumbnail';
export const handle = 'instagram-thumbnail';

export const context = {
  model: {
    id: '1523127055099876608_974226659',
    screenName: 'wellcomecollection',
    type: 'image',
    comments: {
      count: 1
    },
    likes: {
      count: 119
    },
    caption: {
      id: '17869987351105558',
      text: '"Man has gone out to explore other worlds and other civilisations without having explored his own labyrinth of dark passages and secret chambers, and without finding what lies behind doorways that he himself has sealed."-Stanisław Lem, Solaris\n\nThe first stop on #MuseumInstaTour is the @sciencemuseum.They challenged us to find something with the theme FLIGHT.\n\nWe were drawn to these amazing spacecraft models in their Exploring Space gallery.',
      created_time: '1495790915'
    },
    createdAt: new Date(1492712159 * 1000),
    url: 'https://www.instagram.com/p/BUjO_ybA9UA/',
    images: {
      thumbnail: {
        width: 150,
        height: 150,
        url: 'https://scontent.cdninstagram.com/t51.2885-15/s150x150/e35/c0.135.1080.1080/18011958_1775492689430335_7229183373741129728_n.jpg'
      },
      low_resolution: {
        width: 320,
        height: 400,
        url: 'https://scontent.cdninstagram.com/t51.2885-15/e35/p320x320/18011958_1775492689430335_7229183373741129728_n.jpg'
      },
      standard_resolution: {
        width: 640,
        height: 800,
        url: 'https://scontent.cdninstagram.com/t51.2885-15/sh0.08/e35/p640x640/18011958_1775492689430335_7229183373741129728_n.jpg'
      }
    }
  }
};

export const variants = [{
  name: 'video',
  context: {
    model: {
      type: 'video'
    }
  }
}, {
  name: 'carousel',
  context: {
    model: {
      type: 'carousel'
    }
  }
}];
