"use strict";

type Word = {
  entry: {
    id: number;
    form: string;
  };
  translations: {
    title: string;
    forms: string[];
  }[];
  tags: string[];
  contents: {
    title: string;
    text: string;
  }[];
  variations: string[];
  relations: {
    title: string;
    entry: {
      id: number;
      form: string;
    };
  }[];
}

const validateRelID = (dict: Word[]) => {
  const wordsWithError: string[] = []
  const wordsWithRel = dict.filter(word => word.relations.length > 0)
  wordsWithRel.forEach(word => {
    const rel = Array.from(word.relations, rels => rels.entry)
    rel.forEach(r => {
      const rels = dict.filter(w => w.entry.id === r.id)
      if (rels.length === 0 || rels == null) {
        wordsWithError.push(`| Error: RelID of ${word.entry.form} (ID: ${word.entry.id}) is not designated properly\n| ${r.form} (designated RelID: ${r.id})`)
      } else {
        // rels が null だと rels[0] のアクセスで落ちるので else ブロックに評価を隔離している
        if (rels[0].entry.form !== r.form) {
          wordsWithError.push(`| Error: RelID of ${word.entry.form} (ID: ${word.entry.id}) is not designated properly\n| ${r.form} (designated RelID: ${r.id})`)
        }
      }
    })
  })
  if (wordsWithError.length > 0) {
    wordsWithError.forEach(element => console.log(element))
    throw new Error('wrong RelID')
  }
}

export default validateRelID;