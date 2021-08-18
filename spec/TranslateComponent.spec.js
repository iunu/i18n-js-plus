import React from 'react'
import { mount } from 'enzyme'
import { Translate } from '../src/TranslateComponent'
import {
  setTranslationData,
  setLocale,
  getLocale,
  addGlobalTranslationLookup,
  resetGlobalTranslationLookups
} from '../src/main'

// NOTE: We 'mount' our component in a <div>
// because enzyme doesn't like components that return arrays or fragments directly

describe('Translate', () => {
  let originalLocale

  beforeAll(() => {
    resetGlobalTranslationLookups()

    addGlobalTranslationLookup('facility', ['demo_org', 'default'])

    setTranslationData('testing-locale', {
      example: {
        default: {
          unit: {
            board: {
              one: 'Translated Board',
              other: 'Translated Boards',
              withQuantity: {
                one: 'One Translated Board',
                other: '{{quantity}} Translated Boards'
              }
            },
            pot: 'Translated Pot'
          }
        },
        demo_org: {
          unit: {
            board: {
              one: 'Board for Demo',
              other: 'Boards for Demo'
            }
          }
        }
      }
    })

    originalLocale = getLocale()
    setLocale('testing-locale')
  })

  afterAll(() => {
    setLocale(originalLocale)
  })

  it('renders Translated components', () => {
    const wrapper = mount(
      <div>
        <Translate
          scope="example.[facility].unit.[unit]"
          lookup={{
            unit: 'Board'
          }}
        />
      </div>
    )
    expect(wrapper.text()).toEqual('Board for Demo')
  })

  it('renders Translated components, with a default count of 1', () => {
    const wrapper = mount(
      <div>
        <Translate
          scope="example.[facility].unit.[unit]"
          lookup={{
            unit: 'Pot'
          }}
        />
      </div>
    )
    expect(wrapper.text()).toEqual('Translated Pot')
  })

  it('renders Translated components with interpolation and plurals', () => {
    const wrapper = mount(
      <div>
        <Translate
          scope="example.[facility].unit.[unit].withQuantity"
          pluralFor={1000}
          lookup={{
            unit: 'Board'
          }}
          values={{
            quantity: <span>1,000</span>
          }}
        />
      </div>
    )
    expect(wrapper.text()).toEqual('1,000 Translated Boards')
  })
})
