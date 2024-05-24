"use strict"
const fs = require('fs')

/*
type WordEntry = {
  entryForm: string; // 語形
  ID: number; // ID
  wordClasses: string[]; // 品詞
  linzi: string; // 燐字
  meanings: string[]; // 意味
  relatives: string[]; // 関連語
  relIDs: number[]; // 関連語ID
  relTags: string[]; // 関連語タグ
  doublets: string[]; // 同根語
  relativeLip: string[]; // 派生した理語
  ifLipSource: string; // リパライン語ソース
  ifUsed: string; // 用例の存在
  examples: string; // 例文
  comment: string; // 備考
}
*/

function wordParser(word) {
  const [
    id,
    entryForm,
    rawWordClasses,
    linzi,
    rawMeanings,
    rawRelatives,
    rawRelIDs,
    rawRelTags,
    doublets,
    relativeLip,
    isUsed,
    example,
    comment
  ] = word.split('\t');
  return [
    Number(id),
    entryForm,
    rawWordClasses.split("；"),
    linzi,
    rawMeanings.split("；"),
    rawRelatives.split(", "),
    rawRelIDs.split(", ").map(e => Number(e)),
    rawRelTags.split("；"),
    doublets,
    relativeLip,
    isUsed,
    example,
    comment
  ]
}

const wordsWithError = [];
const wordsWithWarning = [];

const lines = fs.readFileSync('../dict.txt', 'utf-8').split(/\r\n|\n/);
const words = lines.map(word => {
  const [
    id,
    entryForm,
    wordClasses,
    linzi,
    meanings,
    relatives,
    relIDs,
    relTags,
    doublets,
    relativeLip,
    isUsed,
    example,
    comment
  ] = wordParser(word);

  const entry = {
    "id": id,
    "form": entryForm
  }
  if (id <= 0 || entryForm === "") {
    wordsWithError.push(`| ERROR: ${entryForm}'s ID and/or entryForm is empty\n| ${id} ${entryForm}`);
  }
  const translations = [];
  if (wordClasses.length !== meanings.length) {
    wordsWithError.push(`| ERROR: ${entryForm}'s meanings are ill-formed\n| [${wordClasses}] [${meanings}]`);
  } else if (wordClasses.some(e => e === "") || meanings.some(e => e === "")) {
    wordsWithWarning.push(`| WARNING: ${entryForm} has an empty property\n| [${wordClasses}] [${meanings}]`);
  } else {
    for (let i = 0; i < wordClasses.length; i++) {
      translations.push({
        "title": wordClasses[i],
        "forms": meanings[i].split("、")
      })
    }
  }
  if (linzi !== "") {
    translations.push({
      "title": "燐字",
      "forms": [linzi]
    })
  }

  const tags = [];
  // if (ifLipSource === "TRUE") tags.push("リパライン語ソース")
  const variations = [];
  const contents = [];
  if (doublets !== "") {
    contents.push({
      "title": "同根語",
      "text": doublets
    })
  }
  if (relativeLip !== "") {
    contents.push({
      "title": "派生した理語",
      "text": relativeLip
    })
  }
  if (example !== "") {
    contents.push({
      "title": "例文",
      "text": example
    })
  }
  if (comment !== "") {
    contents.push({
      "title": "備考",
      "text": comment
    })
  }

  const relations = [];
  if (relatives[0] !== "") {
    if (
      relatives.length !== relIDs.length || relIDs.length !== relTags.length ||
      relatives.some(e => e === "") || relIDs.some(e => e === "")
    ) {
      wordsWithError.push(`| ERROR: ${entryForm}'s relations are ill-formed\n| [${relatives}] [${relIDs}] [${relTags}]`);
    } else if (relTags.some(e => e === "")) {
      wordsWithWarning.push(`| WARNING: ${entryForm} has an empty property\n| [${relatives}] [${relIDs}] [${relTags}]`)
    }else {
      for (let i = 0; i < relatives.length; i++) {
        relations.push({
          "title": relTags[i],
          "entry": {
            "id": relIDs[i],
            "form": relatives[i]
          }
        })
      }
    }
  }
  return {
    "entry": entry,
    "translations": translations,
    "tags": tags,
    "contents": contents,
    "variations": variations,
    "relations": relations
  }
});
if (wordsWithError.length > 0) {
  wordsWithError.forEach(element => console.log(element))
  throw new Error("entry is ill-formed")
}
if (wordsWithWarning.length > 0) {
  wordsWithWarning.forEach(element => console.log(element))
}

fs.writeFileSync('../ail.json', `{
  "words": ${JSON.stringify(words.slice(1), null, 2)},
  "zpdic" : {
    "alphabetOrder" : "",
    "wordOrderType" : "UNICODE",
    "punctuations" : [ ",", "、" ],
    "ignoredTranslationRegex" : "",
    "pronunciationTitle" : null,
    "plainInformationTitles" : [ ],
    "informationTitleOrder" : null,
    "formFontFamily" : null,
    "defaultWord" : {
      "entry" : {
        "id" : -1,
        "form" : ""
      },
      "translations" : [ ],
      "tags" : [ ],
      "contents" : [ ],
      "variations" : [ ],
      "relations" : [ ]
    }
  },
  "snoj" : null
}`)
