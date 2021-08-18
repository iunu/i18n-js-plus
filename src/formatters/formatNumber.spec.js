import { formatNumber, formatNumberForInput } from './formatNumber'

describe('formatNumber', () => {
  beforeAll(() => {})
  afterAll(() => {})

  it('can format numbers', () => {
    expect(formatNumber(100)).toEqual('100')
    expect(formatNumberForInput(100)).toEqual('100')
  })

  it('can format numbers above 1000', () => {
    expect(formatNumber(1000)).toEqual('1,000')
    expect(formatNumberForInput(1000)).toEqual('1000')
  })

  it('can format numbers with decimals', () => {
    expect(formatNumber(1000.25)).toEqual('1,000.25')
    expect(formatNumberForInput(1000.25)).toEqual('1000.25')
  })

  it('can format numbers with decimals and a given precision', () => {
    expect(formatNumber(1000.25, { precision: 3 })).toEqual('1,000.250')
    expect(formatNumberForInput(1000.25, { precision: 3 })).toEqual('1000.250')
  })

  it('can override null options with defaults', () => {
    expect(formatNumber(1000.254, { precision: null })).toEqual('1,000.25')
    expect(formatNumberForInput(1000.254, { precision: null })).toEqual('1000.25')
  })

  it('can format numbers with decimals and a given precision but omit trailing zeroes', () => {
    expect(formatNumber(1000.25, { precision: 3, strip_insignificant_zeros: true })).toEqual('1,000.25')
    expect(formatNumberForInput(1000.25, { precision: 3, strip_insignificant_zeros: true })).toEqual('1000.25')
  })

  it('can format numbers with decimals and a leading 0', () => {
    expect(formatNumber(0.25)).toEqual('0.25')
    expect(formatNumberForInput(0.25)).toEqual('0.25')
  })

  it('can format numbers with different separators', () => {
    expect(formatNumber(1000.25, { separator: ',', delimiter: '.' })).toEqual('1.000,25')
  })

  it('format for input does not format numbers with different separators', () => {
    expect(formatNumberForInput(1000.25, { separator: ',', delimiter: '.' })).toEqual('1000.25')
  })

  it('can format zero', () => {
    expect(formatNumber(0)).toEqual('0')
    expect(formatNumberForInput(0)).toEqual('0')
  })

  it('can format zero decimal', () => {
    expect(formatNumber(0.0, { precision: 1 })).toEqual('0.0')
    expect(formatNumberForInput(0.0, { precision: 1 })).toEqual('0.0')
  })

  it('can format number with ceiling', () => {
    expect(formatNumber(0.1, { ceiling: 0 })).toEqual('1')
    expect(formatNumberForInput(0.1, { ceiling: 0 })).toEqual('1')
    expect(formatNumber(0.11, { ceiling: 1 })).toEqual('0.2')
    expect(formatNumberForInput(0.11, { ceiling: 1 })).toEqual('0.2')
    expect(formatNumber(2.9, { ceiling: 0 })).toEqual('3')
    expect(formatNumberForInput(2.9, { ceiling: 0 })).toEqual('3')

    // handles non-number ceilings
    expect(formatNumber(2.9, { ceiling: '0' })).toEqual('3')
    expect(formatNumberForInput(2.9, { ceiling: '0' })).toEqual('3')
    expect(formatNumber(2.9, { ceiling: '' })).toEqual('2.9')
    expect(formatNumberForInput(2.9, { ceiling: '' })).toEqual('2.9')
    expect(formatNumber(2.9, { ceiling: null })).toEqual('2.9')
    expect(formatNumberForInput(2.9, { ceiling: null })).toEqual('2.9')
    expect(formatNumber(2.9, { ceiling: undefined })).toEqual('2.9')
    expect(formatNumberForInput(2.9, { ceiling: undefined })).toEqual('2.9')
    expect(formatNumber(2.9, { ceiling: 'heyo' })).toEqual('2.9')
    expect(formatNumberForInput(2.9, { ceiling: 'heyo' })).toEqual('2.9')
  })
})
