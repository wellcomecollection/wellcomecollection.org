export const name = 'quote';
export const handle = 'quote';
export const collated = true;
export const status = 'graduated';
export const context = {
  model: {
    body: `<p>Said Hamlet to Ophelia,<br />
              I'll draw a sketch of thee,<br />
              What kind of pencil shall I use? <br />
              2B or not 2B? </p>`,
    footer: `Spike Milligan, A Silly Poem`
  }
};

export const variants = [
  {
    name: 'default',
    context: {
      modifiers: {'with-marks': true},
      data: {
        fontStyles: {s: 'HNM3', m: 'HNM2'}
      }
    }
  },
  {
    name: 'wellcome-bold',
    context: {
      modifiers: {'with-marks': true, 'wb': true},
      data: {
        fontStyles: {s: 'WB5'}
      }
    }
  },
  {
    name: 'lettera',
    context: {
      modifiers: {'lr': true},
      data: {
        fontStyles: {s: 'LR2'}
      }
    }
  },
  {
    name: 'block',
    context: {
      modifiers: {'block': true},
      data: {
        fontStyles: {s: 'HNL3'}
      }
    }
  }
];
