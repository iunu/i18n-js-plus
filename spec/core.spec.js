import { coreFindTranslation, setTranslationData, setLocale, getLocale } from '../src/core'

describe('coreFindTranslation', () => {
  let originalLocale

  beforeAll(() => {
    setTranslationData('testing-locale', {
      example: {
        unit: 'Unit',
        branch: {
          some: 'Some',
          more: 'More'
        },
        plurals: {
          zero: 'No Plurals',
          one: 'One Plural',
          other: '{{quantity}} Plurals'
        },
        blank: ''
      }
    })

    originalLocale = getLocale()
    setLocale('testing-locale')
  })

  afterAll(() => {
    setLocale(originalLocale)
  })

  it('can provide an error message when translation is not found', () => {
    const translation = coreFindTranslation(
      'nonexistent.example'
    )
    expect(translation).toEqual(undefined)
  })

  it('can use a defaultValue when translation is not found', () => {
    const translation = coreFindTranslation(
      'nonexistent.example',
      { defaultValue: 'Default' }
    )
    expect(translation).toEqual('Default')
  })

  it('can find simple values', () => {
    const translation = coreFindTranslation(
      'example.unit'
    )
    expect(translation).toEqual('Unit')
  })

  it('can find value branches', () => {
    const translation = coreFindTranslation(
      'example.branch'
    )
    expect(translation).toEqual({ some: 'Some', more: 'More' })
  })

  it('can find tranlations that are empty strings', () => {
    const translation = coreFindTranslation(
      'example.blank'
    )
    expect(translation).toEqual('')
  })

  it('can find pluralization translations, one', () => {
    const translation = coreFindTranslation(
      'example.plurals',
      { count: 1 }
    )
    expect(translation).toEqual('One Plural')
  })

  it('can find pluralization translations, other', () => {
    const translation = coreFindTranslation(
      'example.plurals',
      { count: 5 }
    )
    expect(translation).toEqual('{{quantity}} Plurals')
  })

  it('can find pluralization translations, zero', () => {
    const translation = coreFindTranslation(
      'example.plurals',
      { count: 0 }
    )
    expect(translation).toEqual('No Plurals')
  })

  it('can accept a list of scopes to search for', () => {
    const translation = coreFindTranslation(
      'example.unit',
      {
        defaults: [
          { scope: 'example.plurals.nonexistent' },
          { scope: 'example.plurals.one' },
          { scope: 'example.unit' }
        ]
      }
    )
    expect(translation).toEqual('Unit')
  })

  it('can find translations in the middle of a list of scopes to search for', () => {
    const translation = coreFindTranslation(
      'example.unit.nonexsitent',
      {
        defaults: [
          { scope: 'example.plurals.nonexistent' },
          { scope: 'example.plurals.one' },
          { scope: 'example.unit' }
        ]
      }
    )
    expect(translation).toEqual('One Plural')
  })

  it('can have fallback translations', () => {
    const translation = coreFindTranslation(
      'example.unit.nonexsitent',
      {
        defaults: [
          { scope: 'example.plurals.nonexistent' }
        ],
        defaultValue: 'Fallback'
      }
    )
    expect(translation).toEqual('Fallback')
  })

  it('can have fallback translations in the list of scopes to search for', () => {
    const translation = coreFindTranslation(
      'example.unit.nonexsitent',
      {
        defaults: [
          { scope: 'example.plurals.nonexistent' },
          { message: 'Fallback' }
        ]
      }
    )
    expect(translation).toEqual('Fallback')
  })

  it('can work with no scope parameter, and only a defaults list', () => {
    const translation = coreFindTranslation(
      null,
      {
        defaults: [
          { scope: 'example.plurals.nonexistent' },
          { scope: 'example.plurals.one' },
          { scope: 'example.unit' }
        ]
      }
    )
    expect(translation).toEqual('One Plural')
  })
})
