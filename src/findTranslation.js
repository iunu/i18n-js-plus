import { coreFindTranslation } from './core'
import { expandScopeTemplateWithExceptions } from './expandScopeTemplate'
import { getGlobalTranslationLookups } from './globalTranslationLookups'

/**
 * @method findTranslation
 * Provides the same behavior as `coreFindTranslation`, but uses a template instead of a simple scope.
 * Any names in square brackets in the scope template are replaced with values from `scopeOptions`
 * And when one or more values are arrays, multiple scopes are generated with all possible combinations.
 *
 * See `expandScopeTemplate` for examples and information about how templates are expanded.
 *
 * @param {*} scopeTemplate - the scope template to generate lookup paths
 * @param {*} scopeContext - data to be interpolated in the scope template
 * @param {*} options - additional options for `translate`
 */
export function findTranslation (scopeTemplate, scopeContext, options) {
  const fullScopeContext = { ...getGlobalTranslationLookups(), ...scopeContext }

  let defaults = expandScopeTemplateWithExceptions(scopeTemplate, fullScopeContext)

  if (options && options.defaultValue) {
    // If a `defaultValue` is provided, replace last the element in defaults, containing a default error message,
    // with the given defaultValue.
    defaults = defaults.slice(0, -1).concat({ message: options.defaultValue })
  }

  return coreFindTranslation(undefined, {
    defaults,
    defaultValue: `[missing "${scopeTemplate}" translation ]`,
    ...options
  })
}
