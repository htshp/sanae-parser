API - namae-parser
====

### Parser class.

構文解析を行うにはParserクラスのインスタンスを作成します。

```js
const sp = require('sanae-parser');

const parser = new gp.Parser({}, {});
```

#### new Parser(ruleSet, actionSet)

- `ruleSet`: { [ruleName: string]: Rule } Object型。構文解析のルールを指定します。
          Objectのkeyにルール名、valueにルール定義を指定します。$beginは指定必須
          です。ルールの詳細については Rule項を参照。

- `actionSet`: { [ruleName: string]: ($:any)=>any } Object型。ルールにマッチした際の
            アクションを指定します。Objectのkeyにルール名を、valueにはkeyで指定し
            たルールがマッチした際のアクションを記載します。
            アクションの詳細についてはAction項を参照。

- 戻り値: Parser型。Parserクラスのインスタンスを返します。

#### Parser.prototype.run(text, verbose=false)

構文解析を行う。

- `text`: String型。解析対象の文字列を指定します。

- `verbose`: Boolean型(default=false)。trueの場合、解析中の動作情報をコンソール
             に出力します。

- 戻り値: $beginルールの戻り値を返します。
- 例外
  - `RuleError`: ルール定義にエラーがあった場合発生する。
  - `ParseError` : 構文解析に失敗した際に発生する。

### Rule

ルールセットはObject型で、プロパティ名にルール名を、値にルール定義を指定します。

ルールはルール名とルール定義により構成されます。ルール名はstring型、ルール定義は
以下の項のルールによって構成されています。

構文解析は`$begin`ルールから始まります。

#### 特殊ルール

特別な意味合いを持つルールがいくつかあります。

| ルール名 | 説明                                               | 
| :------- | :------------------------------------------------- |
| $begin   | 始まりのルールを指定します。このルールは必須です。      |
| $space   | (default=/[ \t\r\n]/) ルール間の空白を表すルール。RegExp型でなければならない。 |

#### Token rule /token/

```js
    $begin: /[0-9]+/
```

正規表現にマッチするルール。

- ルールの戻り値: string型。マッチした文字列

#### Reference rule 'refRule'

```js
    $begin: 'int',
    int: /[0-9]+/
```

別のルールを参照するルール。

- ルールの戻り値: 指定したルールの戻り値

#### Rule list [ rule, rule2... ]

```js
    $begin: [ /[0-9]+/, /[\+]/, /[0-9]+/ ]
```

連続したルールを定義するルール。

- ルールの戻り値: Array型。各ルールの戻り値が格納される。

#### Tagged rule {tag: rule}

```js
    $begin: [ {left: 'int'}, /[\+]/, {right: 'int'} ],
    int: /[0-9]+/
```

ルールの戻り値にタグ名を付けるルール。Taggedルールを含むルールの戻り値は
`タグ名:戻り値`のObject型に変わる。`[ {tag: /a/} ]` の戻り値は`$.tag` で取得でき
るが、`$[0]`では参照できなくなる。

- タグのネスト: Taggedルールがネストしていてもマッチ結果はネストしない。

```js
    $begin: { a: [/a/, {b: /b/} ] }
    
    ...
    
    $.a == [ 'a', 'b' ] // $.a.b のようにはアクセスしない！！！
    $.b == 'b'
```

- ルールの戻り値: Object型。{ [tagName: string]: any } タグとタグ付けされた
                  ルールの戻り値で構成されるObject

#### Or rule or( rule, rule2... )

```js
    $begin: or( /a/, /b/, /c/ )
```

選択ルール。`or(rule, rules2...)`は可変長引数を取る関数であり、指定したルールのどれかにマッチする。

- ルールの戻り値: マッチしたルールの戻り値

#### Time Rule time(rule, count)

```js
    $begin: time(/abc/, 2, -4)
```

繰り返しルール。`time(rule, count...)`はルールと繰り返し回数を取る関数である。
回数は正数でn回以上の繰り返しを、負数でn回以下の繰り返しを指定する。以下指定例

| 繰り返し回数   | 指定方法           | 
| :------------- | :----------------- |
| 0回以上        | time( /a/ )        |
| n回以上        | time( /a/, n )     |
| n回以下        | time( /a/, -n )    |
| n回丁度        | time( /a/, n, -n ) |
| n回以上m回以下 | time( /a/, n, -m ) |

- ルールの戻り値: Array型。ルールの戻り値が配列に格納される。
- Taggedルールとの併用: `time({a: /100/})`のようにtime内にTaggedルールを指定した
                        場合は`$[n].a`とアクセスする。

#### Optional rule optional(rule)

```js
    $begin: optional(/abc/)
```

任意ルール。`optional(rule)`はルールを1つ取る関数である。

- ルールの戻り値: 指定したルールにマッチした場合はそのルールの戻り値を、
                  マッチしなかった場合はnullが返る。

### Action

アクションセットはObject型で、プロパティ名にルール名を、値にアクションを指定します。
アクションはルールがマッチした際に実行されます。アクションはルールの戻り値を取る
関数式を指定します。以下は簡単なアクションの例です。

```js
const ruleSet = {
    $begin: [ 'int', /\+/, 'int' ],
    int: /[0-9]+/
};

const actionSet = {
    $begin: $ => $[0] + $[2],
    int: $ => parseInt($)
};
```
