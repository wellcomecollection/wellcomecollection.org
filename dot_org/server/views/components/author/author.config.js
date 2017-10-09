export const name = 'author';
export const handle = 'author';
export const collated = true;
export const status = 'graduated';
export const context = {
  name: 'Daniel Regan',
  twitterHandle: 'funnytimeofyear',
  image: 'https://placehold.it/400x400'
};

export const variants = [{
  name: 'default',
  label: 'Border Bottom',
  context: {
    modifiers: ['border-bottom']
  }
}, {
  name: 'border-left',
  context: {
    modifiers: ['border-left'],
    description: `<p>Daniel Regan is a photographer and artist based in London, working on themes of mental health and wellbeing. He is the current director of the <a href="https://freespacegallery.org/">Free Space Gallery</a> and Kentish Town Improvement Fund, a charity providing arts activities and therapies across two NHS sites in north London.</p>`
  }
}];
