export default (el) => {
  const computedStyle = window.getComputedStyle(el, ':after').content.replace(/"/g, '').split(' ');
  const palette = computedStyle.map((str, i) => {
    if (!(i % 2)) {
      return { name: str, hex: computedStyle[i+1] };
    }
  }).filter(o => o); // remove the `undefined`s

  palette.forEach((pair) => {
    const descriptionEl = document.createElement('div');
    descriptionEl.innerHTML = `
      <div class="styleguide__hex" style="background: ${pair.hex};">
        <span class="styleguide__color">${pair.name}: <code class="styleguide__hex-code">${pair.hex}</code></span>
      </div>
    `;

    el.appendChild(descriptionEl.querySelector('.styleguide__hex'));
  });

};
