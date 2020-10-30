const fs = require('fs');

const unified = require('unified');
const rehypeParse = require('rehype-parse');
const rehypeSlug = require('rehype-slug');
const rehypeToc = require('rehype-toc');
const rehypeAutolinkHeadings = require('rehype-autolink-headings');
const rehypeStringify = require('rehype-stringify');
const rehypeFormat = require('rehype-format');

const input = fs.readFileSync('html-to-html-input.html', 'utf-8');

// 見出しに ID 付与、先頭に ToC 付与。
const processor = unified()
    .use(rehypeParse, {
      fragment: true  // html・head・body がない HTML ファイルをそのまま変換する (head・body などを自動付与しない)
    })
    .use(rehypeSlug)
    .use(rehypeToc, {
      nav: false,
      cssClasses: {
        toc: '',
        list: '',
        listItem: '',
        link: ''
      },
      customizeTOC: (toc) => {
        const replacer = (children) => {
          children.forEach(child => {
            if(child.type === 'element' && child.tagName === 'ol') {
              child.tagName = 'ul';
            }
            if(child.children) {
              replacer(child.children);
            }
          });
        };
        replacer([toc]);
      }
      //customizeTOCItem: (toc, heading) => {}
    })
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
      upperDoctype: true,
      allowDangerousHtml: true  // - `script` や `style` 要素を受け取った時にそのまま流す
    })
    .use(rehypeFormat, {   // HTML Format
      indent: 2,           // - インデントのスペース数 (Default : 2)
      indentInitial: true  // - 最初のネストでインデントを付けるか (Default : true・`html` 要素などの場合にインデントしたくない人もいるらしい)
    });
  
  const result = processor.processSync(input);
  const output = result.contents;

fs.writeFileSync('html-to-html-output.html', output, 'utf-8');
