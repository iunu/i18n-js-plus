export const PERCENT_BRACKET_REGEX = /^([\s\S]*?)%\{([\s\S]*?)\}([\s\S]*)$/m
export const BRACKET_BRACKET_REGEX = /^([\s\S]*?)\{\{([\s\S]*?)\}\}([\s\S]*)$/m
/* Note: these regexps use `[\s\S]` instead of just `.` because in JavaScript, `.` does not match new lines,
 * even when using the `/m` flag ¯\_(ツ)_/¯
 */

export function _getValueForInterpolation (values, name) {
  let value = values[name]
  if (!value && values._default) {
    value = values._default
  }

  if (typeof value === 'function') {
    value = value(values, name)
  }

  if (value === undefined || value === null) {
    return ''
  } else {
    return value
  }
}

/**
 * @method interpolate
 * Function for interpolating (replacing) placeholders inside a given string with React components.
 *
 * Example Usage:
 *
 * interpolate("Move %{quantity} to %{zone}", {
 *     quantity: 'Example quantity',
 *     zone: 'Example zone'
 *   })
 *
 * Returns:
 *
 * "Move Example quantity to Example zone"
 *
 * @param {String} template - the template string
 * @param {*} values - data to be interpolated in the template
 */
export function interpolate (template, values) {
  const interpolationRegex = (template.indexOf('%{') >= 0) ? PERCENT_BRACKET_REGEX : BRACKET_BRACKET_REGEX
  const resultParts = []
  values = values || {}

  let match
  while (template) {
    match = template.match(interpolationRegex)
    if (match) {
      if (match[1]) {
        resultParts.push(match[1])
      }

      if (match[2]) {
        resultParts.push(_getValueForInterpolation(values, match[2]))
      }

      template = match[3]
    } else {
      resultParts.push(template)
      template = ''
    }
  }

  return resultParts.join('')
}
