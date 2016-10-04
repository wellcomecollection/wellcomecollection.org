const $ = require('jquery')

require('./application')

$(() => {
  require('./styleguide/palette')
  require('./styleguide/toggle-drawer')
  require('./styleguide/toggle-fullscreen')
})
