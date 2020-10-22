---
title: ほげ
date : 2020-01-01
style: |
  body.frontmatter {
    color: #0f0;
  }
---

<script>
function hoge() {
  return 1;
}
</script>

<style>
body.test {
  color: #f00;
  background: #00f;
}
</style>

ということでね。

# Table of Contents

# Example Markdown

テストです_テスト強調_です__テストさらに強調__です`コード`です。

テストです*テスト強調*です**テストさらに強調**です`コード`です。

## 見出し2

テキストです

## テーブル

| テーブル | 見出し |
|----------|--------|
| Hoge     | Fuga   |
| Foo      | Bar    |

### リスト

- リスト
  - ネスト
  - ネスト
- リスト
  - ネスト
    - さらにネスト？2スペース
  - ネスト
      - さらにネスト？4スペース

いかがでしょう

---

## 番号リスト

1. 番号リスト
2. 番号リストです

```bash
# Prism では bash か shell
# refractor.alias('bash', 'sh'); がどこかでできるとそのままイケる
$ ls -la
```

```javascript
function hoge(text) {
  const replaced = text.trim().replace(/foo/u, 'bar');
  return replaced + `${'some'}`;
}
```

> ## 引用
> 
> 引用
> 
> - 引用リスト

以上です。

スタイル・スクリプト。
