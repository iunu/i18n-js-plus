import { findTranslation } from '../src/findTranslation'
import {
  setTranslationData,
  setLocale,
  getLocale,
  addGlobalTranslationLookup,
  resetGlobalTranslationLookups
} from '../src/main'

describe('findTranslation', () => {
  let originalLocale

  beforeAll(() => {
    resetGlobalTranslationLookups()

    originalLocale = getLocale()
    setLocale('testing-locale')
  })

  afterAll(() => {
    setLocale(originalLocale)
  })

  it('can provide an error message when translation is not found', () => {
    const translation = findTranslation(
      'nonexistent.[facility].zone.[name]',
      { facility: ['a', 'b'], name: 'Zone A' }
    )
    expect(translation).toEqual('[missing "nonexistent.[facility:a,b].zone.[name:zone_a]" translation]')
  })

  it('can use a defaultValue when translation is not found', () => {
    const translation = findTranslation(
      'nonexistent.[facility].zone.[name]',
      { facility: ['a', 'b'], name: 'Zone A' },
      { defaultValue: 'Default' }
    )
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

    let translation

    translation = findTranslation(
      'example.[facility].zone.[name]',
      { facility: ['demo_org__hq', 'demo_org', 'default'], name: 'Zone A' }
    )
    expect(translation).toEqual('Zone A (Demo Org)')

    translation = findTranslation(
      'example.[facility].zone.[name]',
      { facility: ['demo_org__hq', 'demo_org', 'default'], name: 'Zone B' }
    )
    expect(translation).toEqual('Zone B (Demo Org, HQ)')

    translation = findTranslation(
      'example.[facility].zone.[name]',
      { facility: ['demo_org__hq', 'demo_org', 'default'], name: 'Zone C' }
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

    let translation

    translation = findTranslation(
      'example.[facility].unit.[name]',
      { facility: ['demo_org__hq', 'demo_org', 'default'], name: 'Board' },
      { count: 1 }
    )
    expect(translation).toEqual('Boarded')

    translation = findTranslation(
      'example.[facility].unit.[name]',
      { facility: ['demo_org__hq', 'demo_org', 'default'], name: 'Board' },
      { count: 2 }
    )
    expect(translation).toEqual('Boarders')

    translation = findTranslation(
      'example.[facility].unit.[name]',
      { facility: ['other_org', 'default'], name: 'Board' },
      { count: 1 }
    )
    expect(translation).toEqual('Board')

    translation = findTranslation(
      'example.[facility].unit.[name]',
      { facility: ['other_org', 'default'], name: 'Board' },
      { count: 2 }
    )
    expect(translation).toEqual('Boards')

    translation = findTranslation(
      'example.default.unit.board.withQuantity',
      { facility: ['other_org', 'default'], name: 'Board' },
      { count: 1, quantity: '1' }
    )
    expect(translation).toEqual('One Board')

    translation = findTranslation(
      'example.default.unit.board.withQuantity',
      { facility: ['other_org', 'default'], name: 'Board' },
      { count: 2000 }
    )
    expect(translation).toEqual('{{quantity}} Boards')
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

    let translation

    translation = findTranslation(
      'example.[facility].unit.[name]'
    )
    expect(translation).toEqual('[missing "example.[facility:].unit.[name:]" translation]')

    addGlobalTranslationLookup('facility', ['demo_org', 'default'])

    translation = findTranslation(
      'example.[facility].unit.[name]',
      { name: 'Board' }
    )
    expect(translation).toEqual('Boarded (Demo Org)')
  })

  it('can handle implicit exception lookups for facilities', () => {
    setTranslationData('testing-locale', {
      example: {
        test: {
          value: 'Value'
        }
      },
      demo_org: {
        exceptions: {
          example: {
            test: {
              value: 'Exceptional Value'
            }
          }
        }
      }
    })

    let translation

    resetGlobalTranslationLookups()
    translation = findTranslation('example.test.value')
    expect(translation).toEqual('Value')

    addGlobalTranslationLookup('facility', ['demo_org', 'default'])
    translation = findTranslation('example.test.value')
    expect(translation).toEqual('Exceptional Value')
  })
})
