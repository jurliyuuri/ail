import { describe, expect, it } from 'vitest'
import { Word } from '../types.ts'
import validateRelID from '../validateRelID.ts'

describe('validateRelID', () => {
  it('no Error', () => {
    expect(validateRelID(mockDict.noError)).toStrictEqual([])
  })
  it('no Matches', () => {
    expect(validateRelID(mockDict.noMatches)).toStrictEqual([
      [2, 'b', 0, 'a']
    ])
  })
  it('wrong form', () => {
    expect(validateRelID(mockDict.wrongForm)).toStrictEqual([
      [2, 'b', 1, 'x']
    ])
  })
})
const mockDict: Record<string, Word[]> = {
  'noError': [{
    entry: { id: 1, form: 'a' },
    translations: [],
    tags: [],
    contents: [],
    variations: [],
    relations: []
  },{
    entry: { id: 2, form: 'b' },
    translations: [],
    tags: [],
    contents: [],
    variations: [],
    relations: [{title: '', entry: {id: 1, form: 'a'}}]
  }],
  'noMatches': [{
    entry: { id: 1, form: 'a' },
    translations: [],
    tags: [],
    contents: [],
    variations: [],
    relations: []
  },{
    entry: { id: 2, form: 'b' },
    translations: [],
    tags: [],
    contents: [],
    variations: [],
    relations: [{title: '', entry: {id: 0, form: 'a'}}]
  }],
  'wrongForm': [{
    entry: { id: 1, form: 'a' },
    translations: [],
    tags: [],
    contents: [],
    variations: [],
    relations: []
  },{
    entry: { id: 2, form: 'b' },
    translations: [],
    tags: [],
    contents: [],
    variations: [],
    relations: [{title: '', entry: {id: 1, form: 'x'}}]
  }],
}