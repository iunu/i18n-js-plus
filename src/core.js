import I18nPlus from './I18nPlus'

export function configureI18n (configuredVersion) {
  I18nPlus.i18n = configuredVersion
}

/**
 * @method setLocale
 * Change the current locale
 *
 * @param {String} locale - locale name
 */
export function setLocale (locale) {
  I18nPlus.i18n.locale = locale
}

/**
 * @method getLocale
 * Get the current locale name
 *
 * @return {String} the current locale name
 */
export function getLocale () {
  return I18nPlus.i18n.locale
}

/**
 * @method coreFindTranslation
 * Using i18n-js, lookup the translation string (or set of translations) for a given scope key.
 *
 * @param {String} scope - The translation scope key to translate into the current locale
 * @param {Object} options - Options for this translation search
 *   Special options:
 *   - `defaultValue`: Value to use if `scope` is not found in translation files
 *   - `defaults`: An array of hashes with `scope` or `message` values used as a lookup path if `scope` is not found
 *   - `locale`: Override current locale
 * @return {} the resulting translation string (or set of translations)
 */
export function coreFindTranslation (scope, options) {
  // This code emulates the behavior inside I18n.translate, as seen in:
  // https://github.com/fnando/i18n-js/blob/37da124dd2215dd3ce8f220bca31452692b64866/app/assets/javascripts/i18n.js#L572
  options = options || {}
  const translationOptions = I18nPlus.i18n.createTranslationOptions(scope, options)
  const optionsWithoutDefault = I18nPlus.i18n.prepareOptions(options)
  delete optionsWithoutDefault.defaultValue

  let result
  let translationOption

  while (translationOptions.length > 0) {
    translationOption = translationOptions.shift()

    if (translationOption.scope !== undefined && translationOption.scope !== null) {
      result = I18nPlus.i18n.lookup(translationOption.scope, optionsWithoutDefault)
      if (result || result === '') {
        if (typeof result === 'object' && options.count !== undefined && options.count !== null) {
          return I18nPlus.i18n.pluralizationLookupWithoutFallback(options.count, I18nPlus.i18n.locale, result)
        } else {
          return result
        }
      }
    } else if (translationOption.message !== undefined && translationOption.message !== null) {
      return translationOption.message
    }
  }

  return undefined
}

/**
 * @method setTranslationData
 * Allows tests to directly define translation data for a specific locale
 *
 * @param {*} locale
 * @param {*} data
 */
export function setTranslationData (locale, data) {
  I18nPlus.i18n.translations[locale] = data
}
