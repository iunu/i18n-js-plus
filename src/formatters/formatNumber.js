import I18nPlus from '../I18nPlus'
import ceil from 'lodash/ceil'

const baseNumberI18NOptions = {
  precision: 2,
  separator: '.',
  delimiter: ''
}

const optionsForNumberLabel = {
  ...baseNumberI18NOptions,
  delimiter: ','
}

/**
 * @method formatNumber
 * Format a number for presentation purposes, as string.
 *
 * @param {Number} n - The number to be formatted
 * @param {Object} options - Format options
 *   - `precision`: How many decimals to display (defaults to `2`)
 *   - `strip_insignificant_zeros`: Remove any insignificant zeroes in decimals
 *   - `separator`: Character to use to separate decimals (defaults to `.`)
 *   - `delimiter`: Character to use to separate groups of thousands (defaults to `,`)
 * @return {String} the formatted number
 */
export function formatNumber (n, options = {}) {
  const { ceiling, precision } = options
  n = isNaN(parseFloat(ceiling)) ? n : ceil(n, ceiling)

  const preparedOptions = I18nPlus.i18n.prepareOptions(
    options,
    optionsForNumberLabel,
    {
      strip_insignificant_zeros: !precision
    }
  )
  return I18nPlus.i18n.toNumber(n, preparedOptions)
}

/**
 * @method formatNumberForInput
 * Format a number for input values/default values.
 *
 * @param {Number} n - The number to be formatted
 * @param {Object} options - Format options
 *   - `precision`: How many decimals to display (defaults to `2`)
 *   - `strip_insignificant_zeros`: Remove any insignificant zeroes in decimals
 * @return {String} the formatted number as valid float/int
 */
export function formatNumberForInput (n, options = {}) {
  const { ceiling, precision, strip_insignificant_zeros } = options
  n = isNaN(parseFloat(ceiling)) ? n : ceil(n, ceiling)

  const preparedOptions = I18nPlus.i18n.prepareOptions(
    {
      precision,
      strip_insignificant_zeros
    },
    baseNumberI18NOptions,
    {
      strip_insignificant_zeros: !options.precision
    }
  )
  return I18nPlus.i18n.toNumber(n, preparedOptions)
}
