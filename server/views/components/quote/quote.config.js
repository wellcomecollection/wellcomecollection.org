export const name = 'quote';
export const handle = 'quote';
export const collated = true;
export const status = 'graduated';
export const context = {
  body: `<p>Said Hamlet to Ophelia,<br />
            I'll draw a sketch of thee,<br />
            What kind of pencil shall I use? <br />
            2B or not 2B? </p>`,
  footer: `<footer class='quote__footer'>Spike Milligan,
           <cite class='quote__cite'>A Silly Poem</cite></footer>`
};

export const variants = [
  {
    name: 'default',
    context: {
      modifiers: ['with-marks']
    }
  },
  {
    name: 'wellcome-bold',
    context: {
      modifiers: ['with-marks', 'wb']
    }
  },
  {
    name: 'lettera',
    context: {
      modifiers: ['lr']
    }
  },
  {
    name: 'block',
    context: {
      modifiers: ['block']
    }
  }
];
