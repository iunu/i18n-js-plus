import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { _getValueForInterpolation, PERCENT_BRACKET_REGEX, BRACKET_BRACKET_REGEX } from './interpolateFunction'

/* Note: these regexps use `[\s\S]` instead of just `.` because in JavaScript, `.` does not match new lines,
 * even when using the `/m` flag ¯\_(ツ)_/¯
 */

/**
 * Component for interpolating (replacing) placeholders inside a given string with React components.
 *
 * Example Usage:
 *
 * <Interpolate
 *   template="Move %{quantity} to %{zone}"
 *   values={{
 *     quantity: <h1>Example quantity</h1>,
 *     zone: <h1>Example zone</h1>
 *   }}
 * />
 *
 * Renders markup
 *
 * <>
 *   <>Move </>
 *   <><h1>Example quantity</h1></>
 *   <> to </>
 *   <><h1>Example zone</h1></>
 * </>
 *
 * @class Interpolate
 */
export function Interpolate (props) {
  let { template, values } = props
  const interpolationRegex = (template.indexOf('%{') >= 0) ? PERCENT_BRACKET_REGEX : BRACKET_BRACKET_REGEX
  const childrenArray = []
  values = values || {}

  let match
  let count = 0
  while (template) {
    match = template.match(interpolationRegex)
    if (match) {
      // NOTE: each element in the array needs to be wrapped in a React.Fragment
      // with a key to prevent the 'Each child in an array or iterator should
      // have a unique "key" prop' warning from being raised
      if (match[1]) {
        childrenArray.push(<Fragment key={count}>{ match[1] }</Fragment>)
        count += 1
      }

      if (match[2]) {
        childrenArray.push(<Fragment key={count}>{ _getValueForInterpolation(values, match[2]) }</Fragment>)
        count += 1
      }

      template = match[3]
    } else {
      childrenArray.push(<Fragment key={count}>{ template }</Fragment>)
      count += 1
      template = ''
    }
  }

  return <Fragment>{ childrenArray }</Fragment>
}

Interpolate.propTypes = {
  template: PropTypes.string.isRequired,
  values: PropTypes.object
}

export default Interpolate
