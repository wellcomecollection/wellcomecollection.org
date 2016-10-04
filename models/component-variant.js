'use strict'

let fs = require('fs')
let _ = require('lodash')
let inflection = require('inflection')

class ComponentVariant {
  constructor(key, dataPath) {
    this.key = key
    this.name = inflection.titleize(key)

    const globalJson = JSON.parse(fs.readFileSync('./views/templates/data/global.json', 'utf8'))
    const componentJson = JSON.parse(fs.readFileSync(dataPath + '/' + key + '.json', 'utf8'))

    this.json = _.merge(globalJson, componentJson)
    this.componentJson = componentJson
  }
}

module.exports = ComponentVariant
