'use strict'

const fs = require('fs')
const _ = require('lodash')
const Component = require('./../models/component')
const collectionPath = './views/components'

let ComponentList = {
  all() {
    let components = []
    let files = fs.readdirSync(collectionPath)

    for (let i in files) {
      let file = files[i]

      if (file[0] === '.') continue

      let filePath = collectionPath + '/' + file
      let stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        components.push(new Component(file, filePath))
      }
    }

    return components
  },

  findByKey(key) {
    let components = ComponentList.all()

    return _.find(components, {'key': key})
  }
}

module.exports = ComponentList
