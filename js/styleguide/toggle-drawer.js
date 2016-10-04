'use strict'

const $ = require('jquery')

const toggleDrawer = (el) => {
  const $el = $(el)
  const $trigger = $('.js-trigger', $el)
  const activeClass = 'is-active'

  const setActive = (value) => {
    if (value) {
      $el.addClass(activeClass)
    } else {
      $el.removeClass(activeClass)
    }
  }

  const getActive = () => {
    return $el.hasClass(activeClass)
  }

  const toggleActive = () => {
    setActive(!getActive())
  }

  const handleEvents = () => {
    $trigger.on('click', (event) => {
      event.preventDefault()

      toggleActive()
    })
  }

  handleEvents()
}

$('.js-toggle-drawer').each((index, item) => {
  toggleDrawer(item)
})
