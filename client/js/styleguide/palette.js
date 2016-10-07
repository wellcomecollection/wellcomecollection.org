(() => {
  'use strict'

  const palette_element = document.getElementById('styleguide__palette')

  if (!palette_element) return

  let palette = window.getComputedStyle(palette_element, ':after').content

  palette = palette.substring(1, palette.length - 1)
  palette = palette.split(' ')

  let pair = {}
  let pairArray = []

  palette.forEach((item, index) => {
    if (index % 2 === 0) {
      pair.name = item
    } else {
      pair.hex = item
      pairArray.push(pair)
      pair = {}
    }
  })

  pairArray.forEach((pair) => {
    // ignore 'currentColor', 'transparent' and 'inherit'
    if (pair.hex.indexOf('#') !== -1) {
      palette_element.innerHTML += `
      <div class="styleguide__hex" style="background: ${pair.hex};">
        <span class="styleguide__colour">${pair.name}: <code class="styleguide__hex-code">${pair.hex}</code></span>
      </div>`
    }
  })
})()

