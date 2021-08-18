import { translate } from '../src/translateFunction'

import {
  setTranslationData,
  setLocale,
  getLocale,
  addGlobalTranslationLookup,
  resetGlobalTranslationLookups
} from '../src/main'

describe('translate', () => {
  let originalLocale
  let translation

  beforeAll(() => {
    resetGlobalTranslationLookups()

    originalLocale = getLocale()
    setLocale('testing-locale')
  })

  afterAll(() => {
    setLocale(originalLocale)
  })

  it('can provide an error message when translation is not found', () => {
    translation = translate('nonexistent.[facility].zone.[name]', {
      lookup: { facility: ['a', 'b'], name: 'Zone A' }
    })
    expect(translation).toEqual('[missing "nonexistent.[facility:a,b].zone.[name:zone_a]" translation]')
  })

  it('can use a fallback when translation is not found', () => {
    setTranslationData('testing-locale', {
      example: {
        label: 'Label'
      }
    })

    translation = translate('example.label', {
      fallback: 'Default'
    })
    expect(translation).toEqual('Label')

    translation = translate('nonexistent.[facility].zone.[name]', {
      fallback: 'Default'
    })
    expect(translation).toEqual('Default')
  })

  it('can find translations by looking up multiple scopes', () => {
    setTranslationData('testing-locale', {
      example: {
        default: {
          zone: {
            zone_a: 'Zone A (Default)',
            zone_b: 'Zone B (Default)',
            zone_c: 'Zone C (Default)'
          }
        },
        demo_org: {
          zone: {
            zone_a: 'Zone A (Demo Org)'
          }
        },
        demo_org__hq: {
          zone: {
            zone_b: 'Zone B (Demo Org, HQ)'
          }
        }
      }
    })

    translation = translate(
      'example.[facility].zone.[name]', {
        lookup: { facility: ['demo_org__hq', 'demo_org', 'default'], name: 'Zone A' }
      }
    )
    expect(translation).toEqual('Zone A (Demo Org)')

    translation = translate(
      'example.[facility].zone.[name]', {
        lookup: { facility: ['demo_org__hq', 'demo_org', 'default'], name: 'Zone B' }
      }
    )
    expect(translation).toEqual('Zone B (Demo Org, HQ)')

    translation = translate(
      'example.[facility].zone.[name]', {
        lookup: { facility: ['demo_org__hq', 'demo_org', 'default'], name: 'Zone C' }
      }
    )
    expect(translation).toEqual('Zone C (Default)')
  })

  it('can deal with pluralization and interpolation', () => {
    setTranslationData('testing-locale', {
      example: {
        default: {
          unit: {
            board: {
              one: 'Board',
              other: 'Boards',
              withQuantity: {
                one: 'One Board',
                other: '{{quantity}} Boards'
              }
            }
          }
        },
        demo_org: {
          unit: {
            board: {
              one: 'Boarded',
              other: 'Boarders'
            }
          }
        }
      }
    })

    translation = translate(
      'example.[facility].unit.[name]', {
        lookup: { facility: ['demo_org__hq', 'demo_org', 'default'], name: 'Board' },
        pluralFor: 1
      }
    )
    expect(translation).toEqual('Boarded')

    translation = translate(
      'example.[facility].unit.[name]', {
        lookup: { facility: ['demo_org__hq', 'demo_org', 'default'], name: 'Board' },
        pluralFor: 2
      }
    )
    expect(translation).toEqual('Boarders')

    translation = translate(
      'example.[facility].unit.[name]', {
        lookup: { facility: ['other_org', 'default'], name: 'Board' },
        pluralFor: 1
      }
    )
    expect(translation).toEqual('Board')

    translation = translate(
      'example.[facility].unit.[name]', {
        lookup: { facility: ['other_org', 'default'], name: 'Board' },
        pluralFor: 2
      }
    )
    expect(translation).toEqual('Boards')

    translation = translate(
      'example.default.unit.board.withQuantity', {
        lookup: { facility: ['other_org', 'default'], name: 'Board' },
        pluralFor: 1,
        values: { quantity: '1' }
      }
    )
    expect(translation).toEqual('One Board')

    translation = translate(
      'example.default.unit.board.withQuantity', {
        lookup: { facility: ['other_org', 'default'], name: 'Board' },
        pluralFor: 2000,
        values: { quantity: '2,000' }
      }
    )
    expect(translation).toEqual('2,000 Boards')
  })

  it('uses the global translation context when available', () => {
    setTranslationData('testing-locale', {
      example: {
        default: {
          unit: {
            board: 'Board'
          }
        },
        demo_org: {
          unit: {
            board: 'Boarded (Demo Org)'
          }
        }
      }
    })

    translation = translate('example.[facility].unit.[name]')
    expect(translation).toEqual('[missing "example.[facility:].unit.[name:]" translation]')

    addGlobalTranslationLookup('facility', ['demo_org', 'default'])

    translation = translate(
      'example.[facility].unit.[name]', {
        lookup: { name: 'Board' }
      }
    )
    expect(translation).toEqual('Boarded (Demo Org)')
  })
})
