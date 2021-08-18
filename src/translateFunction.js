import { findTranslation } from './findTranslation'
import { interpolate } from './interpolateFunction'

/**
 * @method translate
 * Provide a localized translation for a given scope key.
 *
 * This is implemented on top of `i18n-js`, with small variations to the function interface,
 * and the addition of "scope lookup".
 *
 * The main difference is that instead of merging all options in a single object, we use four different keys
 * to support `pluralFor` for pluralization, `values` for interpolation, and `lookup` and `defaultTranslation` for scope lookup.
 *
 * SIMPLE TRANSLATION:
 * `scope` is used to search for a translation string in the translation files managed by `i18n-js` for the current locale.
 *
 * PLURALIZATION:
 * If `scope` matches a set of translations instead of a single string, keyed with `one`, `other` and `zero`, then the
 * value of `options.pluralFor` is used to select the appropriate variation to pluralize that particular number.
 *
 * The default value for `options.pluralFor` is `1` to make it easier to expand our translation trees.
 * This comes handy when we start with a simple scope such as `example.units.boards`, matched
 * with a translation value of `example.units.boards = 'Board'.
 * If/when we decide we need another subscope, such as `example.units.boards.withQuantity`,
 * we can update the translation values so that `example.units.boards` becomes `example.units.boards.one`
 * without having to change existing code that uses `example.units.boards` as a scope.
 * Otherwise, adding subkeys to translation values at `example.units.boards` would cause errors.
 *
 * INTERPOLATION:
 * The translation string matched by `scope` can include interpolation placeholders using `${name}` or `{{name}}`,
 * which get replaced with the value for the given `name` included in `options.values`.
 *
 * LOOKUP:
 * The given `scope` can include placeholders using `[name]` --the scope, not the resulting translation string--
 * which get replaced with values for the given `name` included in `options.lookup`.
 * These values are "normalized" to use only underscores and lowercase alphanumeric characters.
 *
 * If `name` corresponds to an array instead of a single value, then the `scope` will be used to search under those possible values.
 * This means for example:
 *   a `scope` of `"example.[type].[level].label"`
 *   with `options.lookup = {type: 'Name', level: ['Specific', 'Generic']}`
 *   will search for translation strings under `example.name.specific.label` first,
 *   and if not found, under `example.name.generic.label`.
 *
 * If a scope has multiple parts that map into arrays, all combinations will be searched.
 *
 * If no matching string is found, then the optional `options.fallback` will be used instead.
 *
 * @param {String} scope - The translation scope key to translate into the current locale
 * @param {Object} options - Options for this translation
 *   - `lookup`: A set of values to be used to expand the scope into one or more variations to be searched for translations.
 *   - `fallback`: Value to use if a translation for `scope` cannot be found.
 *   - `pluralFor`: Used for "pluralization", when a scope matches multiple translation options like `one`, `other` or `zero`.
 *   - `values`: A set of values that can be referenced in the translation string for interpolation.
 * @return {String} the resulting translation
 */
export function translate (scope, options = {}) {
  const { lookup, fallback, values } = options
  let { pluralFor } = options

  if (pluralFor === undefined || pluralFor === null) {
    pluralFor = 1
  }

  const translation = findTranslation(scope, lookup, { count: pluralFor, defaultValue: fallback })

  return interpolate(translation, values)
}
