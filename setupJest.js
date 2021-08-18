// import 'array-flat-polyfill'
import { configureI18n } from './src/core'
import i18n from 'i18n-js'

const { configure } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')

configure({ adapter: new Adapter() })

global.I18n = i18n
global.I18n.locale = 'en'

configureI18n(global.I18n)
