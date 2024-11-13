import { Word } from "./types.ts";

type ParsedWord = [
  number,
  string,
  string[],
  string[],
  string[],
  string[],
  number[],
  string[],
  string,
  string,
  string,
  string
];

function wordParser(word: string): ParsedWord {
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
    example,
    comment
  ] = word.split('\t');
  return [
    Number(id),
    entryForm,
    rawWordClasses.split("；"),
    linzi.split("；"),
    rawMeanings.split("；"),
    rawRelatives.split(", "),
    rawRelIDs.split(", ").map(e => Number(e)),
    rawRelTags.split("；"),
    doublets,
    relativeLip,
    example.split("；").join("\n"),
    comment
  ]
}

const compose = (lines: string[]): [Word[], string[], string[]] => {
  const wordsWithError: string[] = [];
  const wordsWithWarning: string[] = [];

  if (lines.some(line => line.split("\t").length !== 12)) return [[], ["ERROR: Too many or too few columns"], []]
  const dict: Word[] = lines.map(line => {
    const [
      id, entryForm, wordClasses, linzi, meanings, relatives, relIDs, relTags, doublets, relativeLip, example, comment
    ] = wordParser(line);

    const entry = {
      "id": id,
      "form": entryForm
    };
    if (id <= 0 || Number.isNaN(id) || entryForm === "") {
      wordsWithError.push(`| ERROR: ${entryForm}'s ID and/or entryForm is empty\n| ${id} ${entryForm}\n`);
    }
    const translations = [];
    if (wordClasses.length !== meanings.length) {
      wordsWithError.push(`| ERROR: ${entryForm}'s meanings are ill-formed\n| [${wordClasses}] [${meanings}]\n`);
    } else if (wordClasses.some(e => e === "") || meanings.some(e => e === "")) {
      wordsWithWarning.push(`| WARNING: ${entryForm} has an empty property\n| [${wordClasses}] [${meanings}]\n`);
    }
    for (let i = 0; i < wordClasses.length; i++) {
      translations.push({
        "title": wordClasses[i],
        "forms": meanings[i]?.split("、")
      });
    }

    if (linzi.length > 1 && linzi.includes("")) {
      wordsWithWarning.push(`| WARNING: ${entryForm} has an empty item in linzi\n| ${linzi}\n`);
    } else if (linzi.length !== 0 && !linzi.includes("")) {
      translations.push({
        "title": "燐字",
        "forms": linzi
      });
    }

    const tags: string[] = [];
    const variations: { title: string; form: string; }[] = [];
    const contents = [];
    if (doublets !== "") {
      contents.push({
        "title": "同根語",
        "text": doublets
      });
    }
    if (relativeLip !== "") {
      contents.push({
        "title": "関連する理語",
        "text": relativeLip
      });
    }
    if (example !== "") {
      contents.push({
        "title": "例文",
        "text": example
      });
    }
    if (comment !== "") {
      contents.push({
        "title": "備考",
        "text": comment
      });
    }

    const relations = [];
    if (relatives[0] !== "") {
      if (relatives.length !== relIDs.length || relIDs.length !== relTags.length ||
        relatives.some(e => e === "") || relIDs.some(e => e === 0 || Number.isNaN(e))) {
        wordsWithError.push(`| ERROR: ${entryForm}'s relations are ill-formed\n| [${relatives}] [${relIDs}] [${relTags}]\n`);
      } else if (relTags.some(e => e === "")) {
        wordsWithWarning.push(`| WARNING: ${entryForm} has an empty property\n| [${relatives}] [${relIDs}] [${relTags}]\n`);
      }
      for (let i = 0; i < relatives.length; i++) {
        relations.push({
          "title": relTags[i],
          "entry": {
            "id": relIDs[i],
            "form": relatives[i]
          }
        });
      }

    }
    return {
      "entry": entry,
      "translations": translations,
      "tags": tags,
      "contents": contents,
      "variations": variations,
      "relations": relations
    };
  })
  return [dict, wordsWithError, wordsWithWarning]
};

export default compose