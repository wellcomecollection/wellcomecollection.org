'use strict'

const $ = require('jquery')

$('.js-toggle-fullscreen').on('click', (event) => {
  event.preventDefault()

  $('.js-main').toggleClass('is-fullscreen')
})
