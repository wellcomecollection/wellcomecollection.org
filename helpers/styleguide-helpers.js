'use strict'

let _ = require('lodash')
let fs = require('fs')
let ComponentList = require('./../models/component-list')

module.exports = {
  register(Handlebars) {
    Handlebars.registerHelper('renderComponent', (componentKey, options) => {
      const component = ComponentList.findByKey(componentKey)
      const template = Handlebars.compile(fs.readFileSync(component.templatePath, 'utf8'))

      // default=true, use the component's default JSON
      if (_.has(options.hash, 'default')) {
        options.hash = component.json
      }

      // variant='name', use the component variant's default JSON
      if (_.has(options.hash, 'variant')) {
        options.hash = component.variant(options.hash.variant).json
      }

      // hash={data}, marshall passed hash into correct object
      if (_.has(options.hash, 'data')) {
        options.hash = options.hash.data
      }

      return new Handlebars.SafeString(template(options.hash))
    })

    Handlebars.registerHelper('prettyJson', (json) => {
      return JSON.stringify(json, null, 2)
    })

    Handlebars.registerHelper('assetPath', (path) => {
      return `/dist/assets/${path}`
    })

    Handlebars.registerHelper('partial', function(name, options) {
      Handlebars.registerPartial(name, options.fn)
    })

    Handlebars.registerHelper('block', function(name, options) {
      let loadPartial = function(name) {
        let partial = Handlebars.partials[name]

        if (typeof partial === 'string') {
          partial = Handlebars.compile(partial)
          Handlebars.partials[name] = partial
        }

        return partial
      }

      let partial = loadPartial(name) || options.fn

      return partial(this, { data: options.hash })
    })

    Handlebars.registerHelper('useLayout', function(name, options) {
      const partial = Handlebars.partials[name]

      if (!partial) return ''
      return new Handlebars.SafeString(Handlebars.compile(partial)(this))
    })
  }
}
