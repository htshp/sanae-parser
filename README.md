sanae-parser
====

sanae-parserは構文解析ライブラリです。

## Description

Sanae parserは構文解析ライブラリです。
Javascript上で構文ルールの定義やマッチ時のアクションの指定、構文解析の実行が行えます。

## Install

```sh
$ npm install --save sanae-parser
```

## Demo

加算のみの数式を構文解析し、アクションで計算を行うサンプルです。

```js
const sp = require('sanae-parser');

// Define rule set.
const ruleSet = {
    $begin: 'expr',
    expr: sp.or(
        [ {left: 'int'}, /\+/, {right: 'expr'} ],
        [ {atom: 'int'} ]),
    int: /[0-9]+/
};

// Define action set.
const actionSet = {
    expr: $ => $.left 
        ? $.left + $.right
        : $.atom,
    int: $ => parseInt($)
};

// Create parser instance.
const parser = new sp.Parser( ruleSet, actionSet );

// Run parse.
console.log('1 + 2 = ' + parser.run('1 + 2'));
```

## Requirement

node ^6.11.2

## API

- [API](https://github.com/htshp/sanae-parser/blob/master/doc/api.md)
