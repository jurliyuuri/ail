import { Word } from "./types.ts"

function validateRelID(dict: Word[]): [number, string, number, string][] {
  const wordsWithError: [number, string, number, string][] = []
  dict.filter(word => word.relations.length > 0).forEach(word => {
    const rel = Array.from(word.relations, rels => rels.entry)
    rel.forEach(r => {
      const rels = dict.filter(w => w.entry.id === r.id)
      if (rels.length === 0) {
        wordsWithError.push([word.entry.id, word.entry.form, r.id, r.form])
      } else {
        // rels が空だと rels[0] のアクセスで落ちるので else ブロックに評価を隔離している
        if (rels[0].entry.form !== r.form) {
          wordsWithError.push([word.entry.id, word.entry.form, r.id, r.form])
        }
      }
    })
  })
  return wordsWithError
}

export default validateRelID