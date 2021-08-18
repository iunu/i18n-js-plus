import { expandScopeTemplate, expandScopeTemplateWithExceptions } from '../src/expandScopeTemplate'

describe('expandScopeTemplate', () => {
  beforeAll(() => {
  })

  it('can expand simple scopes', () => {
    const scopes = expandScopeTemplate('test.example.label')
    expect(scopes).toEqual([
      { scope: ['test', 'example', 'label'] },
      { message: '[missing "test.example.label" translation]' }
    ])
  })

  it('can interpolate simple values', () => {
    const scopes = expandScopeTemplate('test.[value].label', { value: '123' })
    expect(scopes).toEqual([
      { scope: ['test', '_123', 'label'] },
      { message: '[missing "test.[value:_123].label" translation]' }
    ])
  })

  it('can deal with missing values', () => {
    const scopes = expandScopeTemplate('test.[value].label', {})
    expect(scopes).toEqual([
      { scope: ['test', 'value', 'label'] },
      { message: '[missing "test.[value:].label" translation]' }
    ])
  })

  it('can extrapolate arrays', () => {
    const scopes = expandScopeTemplate('test.[values].label', { values: ['one', 'another'] })
    expect(scopes).toEqual([
      { scope: ['test', 'one', 'label'] },
      { scope: ['test', 'another', 'label'] },
      { message: '[missing "test.[values:one,another].label" translation]' }
    ])
  })

  it('can extrapolate multiple arrays', () => {
    const scopes = expandScopeTemplate('[roots].test.[values].label', {
      values: ['one', 'another'], roots: ['left', 'right']
    })
    expect(scopes).toEqual([
      { scope: ['left', 'test', 'one', 'label'] },
      { scope: ['left', 'test', 'another', 'label'] },
      { scope: ['right', 'test', 'one', 'label'] },
      { scope: ['right', 'test', 'another', 'label'] },
      { message: '[missing "[roots:left,right].test.[values:one,another].label" translation]' }
    ])
  })

  it('can normalize values', () => {
    const scopes = expandScopeTemplate('test.[values].[more]', { values: ['One', ' With Spaces (really)? ', '123'], more: '$%test' })
    expect(scopes).toEqual([
      { scope: ['test', 'one', 'test'] },
      { scope: ['test', 'with_spaces_really', 'test'] },
      { scope: ['test', '_123', 'test'] },
      { message: '[missing "test.[values:one,with_spaces_really,_123].[more:test]" translation]' }
    ])
  })

  it('will not change non-interpolated parts of the scope', () => {
    const scopes = expandScopeTemplate('testCamelCase.[more]', { more: '$%test' })
    expect(scopes).toEqual([
      { scope: ['testCamelCase', 'test'] },
      { message: '[missing "testCamelCase.[more:test]" translation]' }
    ])
  })
})

describe('expandScopeTemplateWithExceptions', () => {
  beforeAll(() => {
  })

  it('can expand simple scopes including implicit exception paths', () => {
    const scopes = expandScopeTemplateWithExceptions('test.example.label', { facility: ['test__demo_org', 'demo_org', 'default'] })
    expect(scopes).toEqual([
      { scope: ['test__demo_org', 'exceptions', 'test', 'example', 'label'] },
      { scope: ['demo_org', 'exceptions', 'test', 'example', 'label'] },
      { scope: ['test', 'example', 'label'] },
      { message: '[missing "test.example.label" translation]' }
    ])
  })

  it('will not add exceptions if path already included [facility]', () => {
    const scopes = expandScopeTemplateWithExceptions('test.[facility].label', { facility: ['test__demo_org', 'demo_org', 'default'] })
    expect(scopes).toEqual([
      { scope: ['test', 'test__demo_org', 'label'] },
      { scope: ['test', 'demo_org', 'label'] },
      { scope: ['test', 'default', 'label'] },
      { message: '[missing "test.[facility:test__demo_org,demo_org,default].label" translation]' }
    ])
  })
})
