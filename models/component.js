'use strict'

let fs = require('fs')
let _ = require('lodash')
let inflection = require('inflection')
let ComponentVariant = require('./../models/component-variant')

class Component {
  constructor(key, path) {
    this.key = key
    this.path = path
    this.name = inflection.titleize(key)
    this.templatePath = this.path + '/' + key + '.hbs'
    this.dataPath = this.path + '/data'

    let globalJson = JSON.parse(fs.readFileSync('./views/templates/data/global.json', 'utf8'))
    let componentJson = JSON.parse(fs.readFileSync(this.dataPath + '/default.json', 'utf8'))

    this.json = _.merge(globalJson, componentJson)
    this.componentJson = componentJson
    this.variants = []

    let variantDataFiles = fs.readdirSync(this.dataPath)

    for (let i in variantDataFiles) {
      let file = variantDataFiles[i]

      if (file[0] === '.') continue

      if (file === 'default.json') continue

      let variantKey = file.split('.')[0]
      this.variants.push(new ComponentVariant(variantKey, this.dataPath))
    }
  }

  variant(key) {
    return _.find(this.variants, {'key': key})
  }
}


module.exports = Component
