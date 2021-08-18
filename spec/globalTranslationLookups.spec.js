import { setTranslationLookupForFacility, getGlobalTranslationLookups } from '../src/globalTranslationLookups'

describe('setTranslationLookupForFacility', () => {
  beforeAll(() => {
  })

  it('can generate a set of lookup values for a given current facility', () => {
    const facility = {
      slug: 'greenhouse',
      organization: {
        slug: 'acme'
      }
    }

    setTranslationLookupForFacility(facility)
    expect(getGlobalTranslationLookups().facility).toEqual(['acme__greenhouse', 'acme', 'default'])
  })

  it('can generate a set of lookup values from incomplete facility data', () => {
    setTranslationLookupForFacility()
    expect(getGlobalTranslationLookups().facility).toEqual(['default'])

    setTranslationLookupForFacility({})
    expect(getGlobalTranslationLookups().facility).toEqual(['default'])

    setTranslationLookupForFacility({ organization: { slug: 'acme' } })
    expect(getGlobalTranslationLookups().facility).toEqual(['acme__', 'acme', 'default'])
  })
})
