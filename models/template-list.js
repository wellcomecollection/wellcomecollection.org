'use strict'

let _ = require('lodash')
let glob = require('glob')
let path = require('path')
let inflection = require('inflection')
let collectionPath = './views/templates'

const files = (filesPath) => {
  var files = glob.sync(filesPath)

  return _.map(files, (file) => {
    return path.basename(file)
  })
}

class Template {
  constructor(file) {
    this.file = file
  }

  name() {
    let parts = this.key().split('/')
    parts = _.map(parts, (p) => { return inflection.humanize(p).toLowerCase() })
    parts[0] = inflection.titleize(parts[0])

    return parts.join(' ')
  }

  key() {
    return this.file.split('.')[0]
  }

  url() {
    return '/templates/' + this.key()
  }

  variants() {
    return _.map(this.variantPaths(), (variantPath) => {
      return new Template(this.key() + '/' + variantPath)
    })
  }

  variantPaths() {
    return files(collectionPath + '/data/' + this.key() + '/*.json')
  }
}

var TemplateList = {
  all() {
    let templates = []

    _.each(files(collectionPath + '/*.hbs'), (file) => {
      let template = new Template(file)

      templates.push(template)
      _.each(template.variants(), (variant) => {
        templates.push(variant)
      })
    })

    return templates
  }
}

module.exports = TemplateList
