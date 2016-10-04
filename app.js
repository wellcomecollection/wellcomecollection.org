'use strict'

let express = require('express')
let path = require('path')
let hbs = require('hbs')
let app = module.exports = express()

// Express settings
app.use('/dist', express.static(path.join(__dirname, '/dist')))

// View settings
app.set('view engine', 'hbs')

// register partial paths
hbs.registerPartials(__dirname)

// Helpers
require('./helpers/styleguide-helpers').register(hbs.handlebars)

// Controllers
const styleguideController = require('./controllers/styleguide-controller')
const templatesController = require('./controllers/templates-controller')

// Routes
app.get('/', (req, res) => { res.redirect('/about') })
app.get('/about', styleguideController.about)
app.get('/palette', styleguideController.palette)
app.get('/typography', styleguideController.typography)

app.get('/components', styleguideController.components)
app.get('/components/:componentKey', styleguideController.component)
app.get('/components/:componentKey/:variantKey', styleguideController.componentVariant)

app.get('/layouts', styleguideController.layouts)

app.get('/templates', styleguideController.templates)
app.get('/templates/:templateKey', templatesController.show)
app.get('/templates/:templateKey/:dataKey', templatesController.show)

