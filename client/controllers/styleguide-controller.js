'use strict'

const ComponentList = require('./../models/component-list')
const TemplateList = require('./../models/template-list')

module.exports = {
  about: (req, res) => {
    res.render('styleguide/about', {
      layout: 'base/styleguide',
      templates: TemplateList.all(),
      components: ComponentList.all()
    })
  },

  palette: (req, res) => {
    res.render('styleguide/palette', {
      layout: 'base/styleguide',
      templates: TemplateList.all(),
      components: ComponentList.all()
    })
  },

  typography: (req, res) => {
    res.render('styleguide/typography', {
      layout: 'base/styleguide',
      templates: TemplateList.all(),
      components: ComponentList.all()
    })
  },

  components: (req, res) => {
    res.render('styleguide/components', {
      layout: 'base/styleguide',
      templates: TemplateList.all(),
      components: ComponentList.all()
    })
  },

  component: (req, res) => {
    res.render('styleguide/component', {
      layout: 'base/styleguide',
      component: ComponentList.findByKey(req.params.componentKey),
      templates: TemplateList.all(),
      components: ComponentList.all()
    })
  },

  componentVariant: (req, res) => {
    const component = ComponentList.findByKey(req.params.componentKey)

    res.render('styleguide/component_variant', {
      layout: 'base/styleguide',
      component: component,
      variant: component.variant(req.params.variantKey),
      templates: TemplateList.all(),
      components: ComponentList.all()
    })
  },

  templates: (req, res) => {
    res.render('styleguide/templates', {
      layout: 'base/styleguide',
      templates: TemplateList.all(),
      components: ComponentList.all()
    })
  },

  layouts: (req, res) => {
    res.render('styleguide/layouts', {
      layout: 'base/styleguide',
      templates: TemplateList.all(),
      components: ComponentList.all()
    })
  }
}
