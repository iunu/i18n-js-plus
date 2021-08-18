const TRANSLATION_PLACEHOLDERS = /([%{]\{.*?\}+)/gi // matches %{abc} and {{abc}}
const SEQUENCES_OF_NON_ALPHA = /[^a-z0-9_]+/gi // anything that's not basic alphanumeric or underscores
const STRING_SURROUNDED_BY_UNDERSCORES = /^_*(.*?)_*$/gi // used to remove preceding or trailing underscores
const DIGITS_AT_START = /^[0-9]/

/**
 * @method normalizeScopeKey
 * Normalize values so they can be used as i18n scope lookup keys
 *
 * @param {String} str the string to normalize
 * @return {String} the normalized lookup value
 */
export function normalizeScopeKey (str) {
  let normalized = ''
  if (str) {
    normalized = str
      .toLowerCase()
      .replace(TRANSLATION_PLACEHOLDERS, '')
      .replace(SEQUENCES_OF_NON_ALPHA, '_')
      .replace(STRING_SURROUNDED_BY_UNDERSCORES, '$1')

    if (normalized.match(DIGITS_AT_START)) {
      normalized = `_${normalized}`
    }
  }

  return normalized
}

/**
 * @method expandScopeTemplate
 * Replace references in square brackets in the template with values from options.

 * Values are normalized into valid translation keys: downcased, spaces replaced with underscores and
 * non-alphanumeric characters are removed

 * When values are arrays, all possible combinations of values are generated.
 *
 * Examples:
 * - expandScopeTemplate('test.[name].label', {name: 'One example!'})
 *   [['test', 'one_example', 'label']]
 *
 * - expandScopeTemplate('test.[paths].label', {paths: ['Customized', 'Generic']})
 *   [['test', 'customized', 'label'], ['test', 'generic', 'label']]
 *
 * - expandScopeTemplate('test.[paths].[levels].[name].label', {
 *     paths: ['Customized', 'Generic'],
 *     levels: ['top', 'base'],
 *     name: 'Another Example'
 *   })
 *   [
 *     ['test', 'customized', 'top',  'another_example', 'label'],
 *     ['test', 'customized', 'base', 'another_example', 'label'],
 *     ['test', 'generic',    'top',  'another_example', 'label'],
 *     ['test', 'generic',    'base', 'another_example', 'label']
 *   ]
 *
 * NOTE:
 *   Instead of returning scopes as a single strings with dots, we keep them as arrays,
 *   which works just fine inside `translate` and saves us from multiple unnecesary joins and splits.
 *
 * @param {*} template a scope template that might contain value references in square brackets
 * @param {*} context a hash of values to be used as replacements in the template
 * @return {Array} an array of one or more scopes, each one of them an array of scope terms.
 */
export function expandScopeTemplate (template, context) {
  context = context || {}

  let scopes = [[]]
  const missingMessageParts = []

  template.split('.').forEach((part) => {
    let values = part
    const newScopes = []

    if (part.startsWith('[') && part.endsWith(']')) {
      const name = part.slice(1, -1)
      values = context[name]
      if (values) {
        if (!Array.isArray(values)) {
          values = [values]
        }

        values = values.map((value) => normalizeScopeKey(value))
        missingMessageParts.push(`[${name}:${values}]`)
      } else {
        values = [name]
        missingMessageParts.push(`[${name}:]`)
      }
    } else {
      missingMessageParts.push(part)
      values = [part]
    }

    scopes.forEach((scope) => {
      values.forEach((value) => {
        newScopes.push(scope.concat(value))
      })
    })

    scopes = newScopes
  })

  const message = `[missing "${missingMessageParts.join('.')}" translation]`
  return scopes.map((scope) => ({ scope })).concat({ message })
}

/**
 * @method expandScopeTemplateWithExceptions
 * Expands scope templates, and prepends a set of global exception lookups based on facility and organization

 * NOTE:
 *   If the template already includes `[facility]` then no additional lookups are added.
 *
 * @param {*} template a scope template that might contain value references in square brackets
 * @param {*} context a hash of values to be used as replacements in the template
 * @return {Array} an array of one or more scopes, each one of them an array of scope terms.
 */
export function expandScopeTemplateWithExceptions (template, context) {
  context = context || {}

  const scopesWithoutExceptions = expandScopeTemplate(template, context)
  const exceptionLookup = context.facility

  if (template.indexOf('[facility]') >= 0 || !exceptionLookup) {
    return scopesWithoutExceptions
  } else {
    const combinedScopes = []
    // Look for any `scope` row, and combine it with the exception lookup keys
    exceptionLookup.forEach(exception => {
      if (exception !== 'default') {
        scopesWithoutExceptions.forEach(row => {
          if (row.scope) {
            combinedScopes.push({ scope: [exception, 'exceptions', ...row.scope] })
          }
        })
      }
    })

    // Add the regular scope rows at the end
    scopesWithoutExceptions.forEach(row => {
      combinedScopes.push(row)
    })

    return combinedScopes
  }
}

export default expandScopeTemplate
