import React from 'react'
import { mount } from 'enzyme'
import { Interpolate } from '../src/InterpolateComponent'

// NOTE: We 'mount' our component in a <div>
// because enzyme doesn't like components that return arrays or fragments directly

describe('Interpolate', () => {
  it('renders interpolated components with %{brackets}', () => {
    const wrapper = mount(
      <div>
        <Interpolate
          template="Move %{quantity} to %{zone}"
          values={{
            quantity: <h1>Example quantity</h1>,
            zone: <h1>Example zone</h1>
          }}
        />
      </div>
    )
    expect(wrapper.text()).toEqual('Move Example quantity to Example zone')
    expect(wrapper.find('h1')).toHaveLength(2)
    expect(wrapper.find('h1').at(0).text()).toEqual('Example quantity')
    expect(wrapper.find('h1').at(1).text()).toEqual('Example zone')
  })

  it('renders interpolated components with {{brackets}}', () => {
    const wrapper = mount(
      <div>
        <Interpolate
          template="Move {{quantity}} to {{zone}}"
          values={{
            quantity: <h1>Example quantity</h1>,
            zone: <h1>Example zone</h1>
          }}
        />
      </div>
    )
    expect(wrapper.text()).toEqual('Move Example quantity to Example zone')
    expect(wrapper.find('h1')).toHaveLength(2)
    expect(wrapper.find('h1').at(0).text()).toEqual('Example quantity')
    expect(wrapper.find('h1').at(1).text()).toEqual('Example zone')
  })

  it('renders interpolated components with no interpolation', () => {
    const wrapper = mount(
      <div>
        <Interpolate
          template="Move nothing to nothing"
          values={{
            quantity: <h1>Example quantity</h1>,
            zone: <h1>Example zone</h1>
          }}
        />
      </div>
    )
    expect(wrapper.text()).toEqual('Move nothing to nothing')
  })

  it('renders interpolated components with empty interpolation', () => {
    const wrapper = mount(
      <div>
        <Interpolate
          template="Move nothing to nothing {{}}"
          values={{
            quantity: <h1>Example quantity</h1>,
            zone: <h1>Example zone</h1>
          }}
        />
      </div>
    )
    expect(wrapper.text()).toEqual('Move nothing to nothing ')
  })

  it('renders interpolated components with interpolation at the start', () => {
    const wrapper = mount(
      <div>
        <Interpolate
          template="%{zone} moved"
          values={{
            zone: <h1>Example zone</h1>
          }}
        />
      </div>
    )
    expect(wrapper.text()).toEqual('Example zone moved')
  })

  it('renders interpolated components with interpolation at the end', () => {
    const wrapper = mount(
      <div>
        <Interpolate
          template="moved to %{zone}"
          values={{
            zone: <h1>Example zone</h1>
          }}
        />
      </div>
    )
    expect(wrapper.text()).toEqual('moved to Example zone')
  })

  it('renders interpolated components with interpolation at start and end', () => {
    const wrapper = mount(
      <div>
        <Interpolate
          template="%{quantity} in %{zone}"
          values={{
            quantity: <h1>Example quantity</h1>,
            zone: <h1>Example zone</h1>
          }}
        />
      </div>
    )
    expect(wrapper.text()).toEqual('Example quantity in Example zone')
  })

  it('renders interpolated components with only interpolation', () => {
    const wrapper = mount(
      <div>
        <Interpolate
          template="%{zone}"
          values={{
            zone: <h1>Example zone</h1>
          }}
        />
      </div>
    )
    expect(wrapper.text()).toEqual('Example zone')
  })

  it('renders interpolated components with multiline interpolation', () => {
    const wrapper = mount(
      <div>
        <Interpolate
          template="%{quantity}
          in
          %{zone}"
          values={{
            quantity: <h1>Example quantity</h1>,
            zone: <h1>Example zone</h1>
          }}
        />
      </div>
    )
    expect(wrapper.text()).toEqual('Example quantity in Example zone')
  })
})
