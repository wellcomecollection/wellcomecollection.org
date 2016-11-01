export default (el) => {
  const computedStyle = window.getComputedStyle(el, ':after').content.replace(/"/g, '').split(' ');
  const palette = computedStyle.map((str) => {
    const split1 = str.indexOf('|');
    const split2 = str.indexOf(',');
    const cssName = str.slice(0, split1);
    const name = cssName.replace(/-/g, '<span class="styleguide__palette__hyphen">-</span>');
    const hex = str.slice(split1 + 1, split2);
    const attribution = str.slice(split2 + 1);

    return { name, cssName, hex, attribution };
  }).filter((o) => o.hex.indexOf('#') > -1); // Remove non-hex values (e.g. 'currentColor')

  const primaryAttribution = palette.filter((item) => {
    return item.attribution === 'primary';
  });

  const secondaryAttribution = palette.filter((item) => {
    return item.attribution === 'secondary';
  });

  const buildPaletteSection = (type) => {
    const wrappingEl = document.createElement('div');
    const headingEl = document.createElement('h3');
    headingEl.className = 'styleguide__palette__heading';
    wrappingEl.className = 'styleguide__palette__section';
    headingEl.innerHTML = `${type[0].attribution} colours`;
    wrappingEl.appendChild(headingEl);

    type.forEach((pair) => {
      const paletteBlock = document.createElement('div');
      paletteBlock.className = 'styleguide__palette__block';
      paletteBlock.innerHTML = `
        <span class="styleguide__palette__name">${pair.name}</span>
        <div class="styleguide__palette__color styleguide__palette__color--${pair.cssName}" style="background: ${pair.hex};"></div>
        <span class="styleguide__palette__hex">Hex: <code class="styleguide__palette__code">${pair.hex}</code></span>
      `;

      wrappingEl.appendChild(paletteBlock);
    });

    return wrappingEl;
  };

  el.appendChild(buildPaletteSection(primaryAttribution));
  el.appendChild(buildPaletteSection(secondaryAttribution));
};
