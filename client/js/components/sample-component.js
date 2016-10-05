'use strict'

const $ = require('jquery')

const sampleComponent = (el) => {
  console.log('log from the sample component')
}

$('.sample-component').each((index, item) => {
  sampleComponent(item)
})
