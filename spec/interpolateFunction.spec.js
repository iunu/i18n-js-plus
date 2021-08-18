import { interpolate } from '../src/interpolateFunction'

describe('interpolate', () => {
  it('renders interpolated templates with %{brackets}', () => {
    expect(
      interpolate('Move %{quantity} to %{zone}', {
        quantity: 'Example quantity',
        zone: 'Example zone'
      })
    ).toEqual('Move Example quantity to Example zone')
  })

  it('renders interpolated components with {{brackets}}', () => {
    expect(
      interpolate('Move {{quantity}} to {{zone}}', {
        quantity: 'Example quantity',
        zone: 'Example zone'
      })
    ).toEqual('Move Example quantity to Example zone')
  })

  it('renders interpolated components with no interpolation', () => {
    expect(
      interpolate('Move nothing to nothing', {
        quantity: 'Example quantity',
        zone: 'Example zone'
      })
    ).toEqual('Move nothing to nothing')
  })

  it('renders interpolated components with empty interpolation', () => {
    expect(
      interpolate('Move nothing {{}} to nothing', {
        quantity: 'Example quantity',
        zone: 'Example zone'
      })
    ).toEqual('Move nothing  to nothing')
  })

  it('renders interpolated components with interpolation at the start', () => {
    expect(
      interpolate('%{zone} moved', {
        quantity: 'Example quantity',
        zone: 'Example zone'
      })
    ).toEqual('Example zone moved')
  })

  it('renders interpolated components with interpolation at the end', () => {
    expect(
      interpolate('moved to %{zone}', {
        quantity: 'Example quantity',
        zone: 'Example zone'
      })
    ).toEqual('moved to Example zone')
  })

  it('renders interpolated components with interpolation at start and end', () => {
    expect(
      interpolate('%{quantity} in %{zone}', {
        quantity: 'Example quantity',
        zone: 'Example zone'
      })
    ).toEqual('Example quantity in Example zone')
  })

  it('renders interpolated components with only interpolation', () => {
    expect(
      interpolate('%{zone}', {
        quantity: 'Example quantity',
        zone: 'Example zone'
      })
    ).toEqual('Example zone')
  })

  it('renders interpolated components with multiline interpolation', () => {
    expect(
      interpolate('%{quantity}\n in \n%{zone}', {
        quantity: 'Example quantity',
        zone: 'Example zone'
      })
    ).toEqual('Example quantity\n in \nExample zone')
  })

  it('supports a default interpolation value', () => {
    expect(
      interpolate('%{quantity} in %{zone}', {
        quantity: 'Example quantity',
        _default: '[Default Value]'
      })
    ).toEqual('Example quantity in [Default Value]')
  })

  it('supports delayed evaluation of interpolation values', () => {
    expect(
      interpolate('%{quantity} in %{zone}', {
        quantity: 'Example quantity',
        zone: (_values, name) => `Zone (as ${name})`
      })
    ).toEqual('Example quantity in Zone (as zone)')
  })

  it('supports delayed evaluation of default interpolation values', () => {
    expect(
      interpolate('%{quantity} in %{zone}', {
        quantity: 'Example quantity',
        _default: (_values, name) => `[Missing ${name}]`
      })
    ).toEqual('Example quantity in [Missing zone]')
  })

  it('supports delayed evaluation of interpolation values with access to more values', () => {
    expect(
      interpolate('%{quantity} in %{upcased_zone}', {
        quantity: 'Example quantity',
        zone: 'Example zone',
        upcased_zone: (values, _name) => (values.zone && values.zone.toUpperCase())
      })
    ).toEqual('Example quantity in EXAMPLE ZONE')
  })
})
