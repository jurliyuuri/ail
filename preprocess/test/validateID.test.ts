import { describe, expect, it } from 'vitest'
import validateID from '../validateIDs.ts'

describe('ID validation', () => {
  it('no duplication', () => {
    expect(validateID([1,2,3,4,5])).toStrictEqual([])
  })
  it('single', () => {
    expect(validateID([1,2,3,4,4])).toStrictEqual([4])
  })
  it('double', () => {
    expect(validateID([1,2,2,4,4])).toStrictEqual([2,4])
  })
  it('double (2)', () => {
    expect(validateID([1,2,3,4,2])).toStrictEqual([2])
  })
  it('triplet', () => {
    expect(validateID([1,2,2,4,2])).toStrictEqual([2, 2])
  })
  it('triplet (2)', () => {
    expect(validateID([1,2,3,4,2,3,2,5])).toStrictEqual([2, 3, 2])
  })
})