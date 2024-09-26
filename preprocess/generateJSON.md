# generationJSON.jsの挙動まとめ
[アイル語辞書スプレッドシート](https://docs.google.com/spreadsheets/d/1Han8vd6RHVaT0CV6svMh840AgeAiqi7ieY2kbuBbfEk/edit)から tsv 形式で wget したデータをパースし、ail.json として OTM-JSON 形式で出力する。

## スプレッドシート形式
ID、語形、品詞、燐字、意味、関連語、関連語ID、関連語タグ、同根語、関連する理語、例文、備考の計13カラムを持つ。

このうち ID、語形の2つは埋まっている必要がある。

区切り文字は、
 - 品詞、燐字、意味、関連語タグ、例文: `；`（全角セミコロン）  
 - 関連語、関連語ID、同根語、関連する理語: `, `（コンマ + 半角スペース）  
となっている。

## ERROR
JSON 生成を中断しているもの

### entry is ill-formed
#### ${entryForm}'s ID and/or entryForm is empty
ID か語形に空文字がある。

#### ${entryForm}'s meanings are ill-formed
品詞と意味の個数が一致しない。

空文字列を入れているのではなく個数がそもそも一致しない場合はヒューマンエラーの可能性が高いため ERROR 扱い。

```
| ERROR: noyaii's meanings are ill-formed
| [名詞,動詞] [学問、勉強学ぶ、勉強する]
```

#### ${entryForm}'s relations are ill-formed
関連語と関連語IDと関連語タグの個数が一致しない。または関連語かIDに空文字列がある。

relations プロパティの挙動にかかわるため ERROR 扱い。

```
| ERROR: noyaii's relations are ill-formed
| [noyhep,noytuiku] [491,492] [派生関係派生関係]
```

## WARNING
意図した挙動でない場合は解決すべきもの

#### ${entryForm} has an empty property
品詞・意味・関連語タグのどれかに空文字列がある。

あえて空文字列で仮置きしておきたいエントリが存在することはあるため、WARNING として通知はするものの JSON 生成はそのまま行う。

```
| WARNING: noyaii has empty property
| [名詞,動詞] [学問、勉強,]
```

#### ${entryForm} has an empty item in linzi
燐字のなかに区切り文字`；`があり、かつ区切った後に空文字列`""`が残る。

```
| WARNING: vaoa has an empty item in linzi
| ,
```