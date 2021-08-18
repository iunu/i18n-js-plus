import React from 'react'
import PropTypes from 'prop-types'
import { Interpolate } from './InterpolateComponent'
import { findTranslation } from './findTranslation'

/**
 * @class Translate
 * Component for translating strings, with React components interpolation.
 * Supports the same options as the I18nPlus `translate` function
 *
 * Example Usage:
 *
 * <Translate
 *   scope="translations.[stage].description.[action].with_zone"
 *   lookup={{
 *     stage: [currentStage.stage_type, 'default_stage'],
 *     action: action.action_type
 *   }}
 *   fallback={'Missing Translation'}
 *   pluralFor={1000}
 *   values={{
 *     quantity: <h1>1,000</h1>,
 *     zone: <h1>Example zone</h1>
 *   }}
 * />
 *
 * Where 'translations.growth_stage.description.move.with_zone' maps to 'Move %{quantity} to %{zone}'
 * Renders markup
 *   <>
 *     <>Move </>
 *     <><h1>1,000</h1></>
 *     <> to </>
 *     <><h1>Example zone</h1></>
 *   </>
 *
 * It supports basic scopes, scopes with lookups, pluralization,
 * basic interpolation and components as interpolation values.
 *
 */
export function Translate (props) {
  const { scope, fallback, lookup, ...otherProps } = props
  let { pluralFor } = props

  if (pluralFor === undefined || pluralFor === null) {
    pluralFor = 1
  }

  const translation = findTranslation(scope, lookup, { count: pluralFor, defaultValue: fallback })

  return <Interpolate template={translation} {...otherProps} />
}

Translate.propTypes = {
  scope: PropTypes.string.isRequired,
  lookup: PropTypes.object,
  fallback: PropTypes.string,
  pluralFor: PropTypes.number,
  values: PropTypes.object
}

export default Translate
