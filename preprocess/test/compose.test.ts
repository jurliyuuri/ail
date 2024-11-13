import { describe, expect, it } from "vitest"
import compose from "../compose.ts"

describe("good pattern", () => {
  it("minimum", () => {
    expect(compose(["1\ta\t\t\t\t\t\t\t\t\t\t"])).toStrictEqual([
      [{
        entry: { id: 1, form: "a" },
        translations: [{ title: "", forms: [""] }],
        tags: [],
        contents: [],
        variations: [],
        relations: []
      }],
      [],
      ["| WARNING: a has an empty property\n| [] []\n"]
    ])
  })
  it("with class", () => {
    expect(compose(["1\tasi\t名詞\t\t一\t\t\t\t\t\t\t"])).toStrictEqual([
      [{
        entry: { id: 1, form: "asi" },
        translations: [{ title: "名詞", forms: ["一"] }],
        tags: [],
        contents: [],
        variations: [],
        relations: []
      }],
      [],
      []
    ])
  })
  it("with Linzi", () => {
    expect(compose(["1\tasi\t\t一；二\t\t\t\t\t\t\t\t"])).toStrictEqual([
      [{
        entry: { id: 1, form: "asi" },
        translations: [{ title: "", forms: [""] }, { title: "燐字", forms: ["一", "二"] }],
        tags: [],
        contents: [],
        variations: [],
        relations: []
      }],
      [],
      ["| WARNING: asi has an empty property\n| [] []\n"]
    ])
  })
  it("with doublet", () => {
    expect(compose(["1\tasi\t\t\t\t\t\t\tet2.pk\t\t\t"])).toStrictEqual([
      [{
        entry: { id: 1, form: "asi" },
        translations: [{ title: "", forms: [""] }],
        tags: [],
        contents: [{ title: "同根語", text: "et2.pk" }],
        variations: [],
        relations: []
      }],
      [],
      ["| WARNING: asi has an empty property\n| [] []\n"]
    ])
  })
  it("with class & Linzi & doublet & relative", () => {
    expect(compose(["1\tasi\t名詞\t一\t一\t壱\t1\t関連語\tet2.pk\t\t\t"])).toStrictEqual([
      [{
        entry: { id: 1, form: "asi" },
        translations: [{ title: "名詞", forms: ["一"] }, { title: "燐字", forms: ["一"] }],
        tags: [],
        contents: [{ title: "同根語", text: "et2.pk" }],
        variations: [],
        relations: [{ title: "関連語", entry: { id: 1, form: "壱" } }]
      }],
      [],
      []
    ])
  })
  it("with comment", () => {
    expect(compose(["1\tasi\t名詞\t\t一\t\t\t\t\t\t\thoge"])).toStrictEqual([
      [{
        entry: { id: 1, form: "asi" },
        translations: [{ title: "名詞", forms: ["一"] }],
        tags: [],
        contents: [{ title: "備考", text: "hoge" }],
        variations: [],
        relations: []
      }],
      [],
      []
    ])
  })
  it("with example", () => {
    expect(compose(["1\tasi\t名詞\t\t一\t\t\t\t\t\thoge\t"])).toStrictEqual([
      [{
        entry: { id: 1, form: "asi" },
        translations: [{ title: "名詞", forms: ["一"] }],
        tags: [],
        contents: [{ title: "例文", text: "hoge" }],
        variations: [],
        relations: []
      }],
      [],
      []
    ])
  })
  it("maximum", () => {
    expect(compose(["10\tdado\t名詞；動詞\t集\tグループ；集める\tcepu\t2\t関連語\tdat2.pk\tdadorta\thoge\t地域としての郡はdadoを用いるが、自治体政府としての郡にはcepuを用いる。"])).toStrictEqual([
      [{
        entry: { id: 10, form: "dado" },
        translations: [{ title: "名詞", forms: ["グループ"] }, { title: "動詞", forms: ["集める"] }, { title: "燐字", forms: ["集"] }],
        tags: [],
        contents: [{ title: "同根語", text: "dat2.pk" }, { title: "関連する理語", text: "dadorta" }, { title: "例文", text: "hoge" }, { title: "備考", text: "地域としての郡はdadoを用いるが、自治体政府としての郡にはcepuを用いる。" }],
        variations: [],
        relations: [{ title: "関連語", entry: { id: 2, form: "cepu" } }]
      }],
      [],
      []
    ])
  })
})

describe("error pattern", () => {
  it("column error (many)", () => {
    expect(compose(["\t\t\t\t\t\t\t\t\t\t\t\t\t\t", ""])).toStrictEqual([
      [],
      ["ERROR: Too many or too few columns"],
      []
    ])
  })
  it("column error (few)", () => {
    expect(compose(["\t\t\t\t\t\t\t\t\t"])).toStrictEqual([
      [],
      ["ERROR: Too many or too few columns"],
      []
    ])
  })
  it("no ID", () => {
    expect(compose(["\ta\t\t\t\t\t\t\t\t\t\t"])).toStrictEqual([
      [{
        entry: { id: 0, form: "a" },
        translations: [{ title: "", forms: [""] }],
        tags: [],
        contents: [],
        variations: [],
        relations: []
      }],
      ["| ERROR: a's ID and/or entryForm is empty\n| 0 a\n"],
      ["| WARNING: a has an empty property\n| [] []\n"]
    ])
  })
  it("ID is 0", () => {
    expect(compose(["0\ta\t\t\t\t\t\t\t\t\t\t"])).toStrictEqual([
      [{
        entry: { id: 0, form: "a" },
        translations: [{ title: "", forms: [""] }],
        tags: [],
        contents: [],
        variations: [],
        relations: []
      }],
      ["| ERROR: a's ID and/or entryForm is empty\n| 0 a\n"],
      ["| WARNING: a has an empty property\n| [] []\n"]
    ])
  })
  it("no entry", () => {
    expect(compose(["1\t\t\t\t\t\t\t\t\t\t\t"])).toStrictEqual([
      [{
        entry: { id: 1, form: "" },
        translations: [{ title: "", forms: [""] }],
        tags: [],
        contents: [],
        variations: [],
        relations: []
      }],
      ["| ERROR: 's ID and/or entryForm is empty\n| 1 \n"],
      ["| WARNING:  has an empty property\n| [] []\n"]
    ])
  })
  it("too many classes", () => {
    // wordClass の数で for を回しているため、ここだけ undefined が混ざる
    expect(compose(["1\ta\t名詞；名詞\t\tあ\t\t\t\t\t\t\t"])).toStrictEqual([
      [{
        entry: { id: 1, form: "a" },
        translations: [{ title: "名詞", forms: ["あ"] }, { title: "名詞", forms: undefined }],
        tags: [],
        contents: [],
        variations: [],
        relations: []
      }],
      ["| ERROR: a's meanings are ill-formed\n| [名詞,名詞] [あ]\n"],
      []
    ])
  })
  it("too many meaning", () => {
    expect(compose(["1\ta\t名詞\t\tあ；あ\t\t\t\t\t\t\t"])).toStrictEqual([
      [{
        entry: { id: 1, form: "a" },
        translations: [{ title: "名詞", forms: ["あ"] }],
        tags: [],
        contents: [],
        variations: [],
        relations: []
      }],
      ["| ERROR: a's meanings are ill-formed\n| [名詞] [あ,あ]\n"],
      []
    ])
  })
  it("too many relative", () => {
    // relative の数で for を回しているため、ここだけ undefined が混ざる
    expect(compose(["1\ta\t名詞\t\tあ\ta, b\t1\t関連語\t\t\t\t"])).toStrictEqual([
      [{
        entry: { id: 1, form: "a" },
        translations: [{ title: "名詞", forms: ["あ"] },],
        tags: [],
        contents: [],
        variations: [],
        relations: [{ title: "関連語", entry: { form: "a", id: 1 } }, { title: undefined, entry: { form: "b", id: undefined } },]
      }],
      ["| ERROR: a's relations are ill-formed\n| [a,b] [1] [関連語]\n"],
      []
    ])
  })
  it("too many relIDs", () => {
    expect(compose(["1\ta\t名詞\t\tあ\ta\t1, 2\t関連語\t\t\t\t"])).toStrictEqual([
      [{
        entry: { id: 1, form: "a" },
        translations: [{ title: "名詞", forms: ["あ"] }],
        tags: [],
        contents: [],
        variations: [],
        relations: [{ title: "関連語", entry: { form: "a", id: 1 } }]
      }],
      ["| ERROR: a's relations are ill-formed\n| [a] [1,2] [関連語]\n"],
      []
    ])
  })
  it("too many relTags", () => {
    expect(compose(["1\ta\t名詞\t\tあ\ta\t1\t関連語；\t\t\t\t"])).toStrictEqual([
      [{
        entry: { id: 1, form: "a" },
        translations: [{ title: "名詞", forms: ["あ"] }],
        tags: [],
        contents: [],
        variations: [],
        relations: [{ title: "関連語", entry: { form: "a", id: 1 } }]
      }],
      ["| ERROR: a's relations are ill-formed\n| [a] [1] [関連語,]\n"],
      []
    ])
  })
})

describe("warning pattern", () => {
  it("empty class", () => {
    expect(compose(["1\ta\t\t\tあ\t\t\t\t\t\t\t"])).toStrictEqual([
      [{
        entry: { id: 1, form: "a" },
        translations: [{ title: "", forms: ["あ"] }],
        tags: [],
        contents: [],
        variations: [],
        relations: []
      }],
      [],
      ["| WARNING: a has an empty property\n| [] [あ]\n"]
    ])
  })
  it("empty meanings", () => {
    expect(compose(["1\ta\t名詞\t\t\t\t\t\t\t\t\t"])).toStrictEqual([
      [{
        entry: { id: 1, form: "a" },
        translations: [{ title: "名詞", forms: [""] }],
        tags: [],
        contents: [],
        variations: [],
        relations: []
      }],
      [],
      ["| WARNING: a has an empty property\n| [名詞] []\n"]
    ])
  })
  it("empty relTags", () => {
    expect(compose(["1\ta\t名詞\t\t一\ta\t1\t\t\t\t\t"])).toStrictEqual([
      [{
        entry: { id: 1, form: "a" },
        translations: [{ title: "名詞", forms: ["一"] }],
        tags: [],
        contents: [],
        variations: [],
        relations: [{ title: "", entry: { form: "a", id: 1 } }]
      }],
      [],
      ["| WARNING: a has an empty property\n| [a] [1] []\n"]
    ])
  })
  it("empty linzi", () => {
    expect(compose(["1\ta\t名詞\t一；\t一\t\t\t\t\t\t\t"])).toStrictEqual([
      [{
        entry: { id: 1, form: "a" },
        translations: [{ title: "名詞", forms: ["一"] }],
        tags: [],
        contents: [],
        variations: [],
        relations: []
      }],
      [],
      ["| WARNING: a has an empty item in linzi\n| 一,\n"]
    ])
  })
})