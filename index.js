const fs = require('fs').promises;

const unified = require('unified');
const remarkParse = require('remark-parse');  // v9.0.0 以降はアンダースコアによる強調が行える Pedantic モードが廃止されたため、直前のバージョンである v8.0.3 を使用する。v8.0.3 は remark-gfm 相当が同梱されている
const remarkFrontmatter = require('remark-frontmatter');
const remarkExtractFrontmatter = require('remark-extract-frontmatter');
const yaml = require('yaml');
//const remarkSectionize = require('remark-sectionize');  // remark-sectionize@1.1.1 を検証した
const remarkRehype = require('remark-rehype');
const rehypePrism = require('@mapbox/rehype-prism');
const rehypeSlug = require('rehype-slug');
const rehypeToc = require('@jsdevtools/rehype-toc');
const rehypeAutolinkHeadings = require('rehype-autolink-headings');
const rehypeStringify = require('rehype-stringify');
const rehypeFormat = require('rehype-format');
//const unistUtilInspect = require('unist-util-inspect');  // unist-util-inspect@6.0.0 を検証した

(async () => {
  try {
    const inputMarkdownText = await fs.readFile('./example.md', 'utf-8');
    //inspectMarkdownToHtml(inputMarkdownText);
    const outputHtmlCode = await markdownToHtml(inputMarkdownText);
    console.log(outputHtmlCode);
  }
  catch(error) {
    console.error('ERROR :\n', error, '\nERROR');
  }
})();

/*
function inspectMarkdownToHtml(inputMarkdownText) {
  // processor.process() = parse() And run() And stringify()
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify);
  
  const mdast = processor.parse(inputMarkdownText);
  console.log('mdast :\n', unistUtilInspect(mdast), '\nmdast\n');
  console.log('Raw mdast :\n', mdast, '\nRaw mdast\n');
  
  const hast = processor.runSync(mdast);
  console.log('hast :\n', unistUtilInspect(hast), '\nhast\n');
  console.log('Raw hast :\n', hast, '\nRaw hast\n');
}
 */

async function markdownToHtml(inputMarkdownText) {
  const processor = unified()
    .use(remarkParse, {  // Markdown To mdast (Markdown AST)
      commonmark: true,
      gfm       : true,
      pedantic  : true
    })
    .use(remarkFrontmatter, [  // Parse Frontmatter : Extract Frontmatter のために必要
      {
        type: 'yaml',
        marker: '-',
        anywhere: false
      }
    ])
    .use(remarkExtractFrontmatter, {  // Extract Frontmatter : result.data.frontmatter['title'] のように取得できるようにする
      yaml: yaml.parse,
      name: 'frontmatter'
    })
    //.use(remarkSectionize)  // `section` 要素で囲む : `script`・`style` 要素が改行されなくなるが使える
    .use(remarkRehype, {        // mdast To hast (HTML AST)
      allowDangerousHtml: true  // - `script` や `style` 要素を流す
    })
    .use(rehypePrism, {    // Add Prism.js : refactor.alias('bash', 'sh'); としたいが埋め込める場所なし (Fork するか？)
      ignoreMissing: true  // - 存在しない言語名を書いた時に無視するかどうか
    })
    .use(rehypeSlug)  // Add Slug (Headline ID) In hast
    .use(rehypeToc)  // Add Table of Contents : Options https://github.com/JS-DevTools/rehype-toc#usage
    .use(rehypeAutolinkHeadings, {  // Add Header Link
      behavior: 'prepend',          // - 'append'・'wrap'・'before'・'after' で位置を選べる
      properties: {},               // - `a` 要素に付与する属性
      content: {                    // - hast Node として `a` 要素の子要素を定義する
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['icon-header-link']
        },
        children: [
          //{ type: 'text', value: '$' }  // こんなこともできる
        ]
      }
    })
    .use(rehypeStringify, {     // hast To HTML
      upperDoctype: true,       // - `<!DOCTYPE html>` にする (ヘッダを付ける場合)
      allowDangerousHtml: true  // - `script` や `style` 要素を受け取った時にそのまま流す
    })
    .use(rehypeFormat, {   // HTML Format
      indent: 2,           // - インデントのスペース数 (Default : 2)
      indentInitial: true  // - 最初のネストでインデントを付けるか (Default : true・`html` 要素などの場合にインデントしたくない人もいるらしい)
    });
  
  const result = await processor.process(inputMarkdownText);
  
  console.log(result.data.frontmatter);
  
  return result.contents;
}
