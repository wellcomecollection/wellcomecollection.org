'use strict'

let _ = require('lodash')
let fs = require('fs')

const data = (templateKey, dataKey) => {
  let data = dataFor('global')
  data = _.merge(data, dataFor(templateKey))

  if (dataKey) {
    let additionalData = dataFor(templateKey, dataKey)

    _.each(additionalData, (value, key) => {
      data[key] = value
    })
  }

  return data
}

function dataFor() {
  let args = Array.prototype.slice.call(arguments)

  return JSON.parse(fs.readFileSync('./views/templates/data/' + args.join('/') + '.json', 'utf8'))
}

module.exports = {
  show(req, res) {
    let templateKey = req.params.templateKey
    let dataKey = req.params.dataKey

    res.render('templates/' + templateKey, data(templateKey, dataKey))
  }
}
