const fs = require('fs').promises;

const unified         = require('unified');
const remarkParse     = require('remark-parse');
const remarkRehype    = require('remark-rehype');
const rehypeSlug      = require('rehype-slug');
const rehypeToc       = require('@jsdevtools/rehype-toc');
const rehypeStringify = require('rehype-stringify');
const rehypeFormat    = require('rehype-format');

(async () => {
  try {
    await main();
  }
  catch(error) {
    console.error('ERROR :\n', error, '\nERROR');
  }
})();

async function main() {
  const processor = unified()
    .use(remarkParse)       // Markdown To mdast (Markdown AST)
    .use(remarkRehype)      // mdast To hast (HTML AST)
    .use(rehypeSlug)        // Add Slug (Headline ID) In hast
    .use(rehypeToc)         // Add Table of Contents : Options https://github.com/JS-DevTools/rehype-toc#usage
    .use(rehypeStringify)   // hast To HTML
    .use(rehypeFormat);     // HTML Format
  
  const input = await fs.readFile('./index.md', 'utf-8');
  
  const result = await processor.process(input);
  const contents = result.contents;  // HTML Code
  console.log(contents);
}

/*

# Ref

- https://github.com/remarkjs/awesome-remark
- Unuse
  - remark-html : remark-rehype And rehype-stringify
  - remark-slug : https://github.com/remarkjs/remark-slug
  - remark-autolink-headings : https://github.com/remarkjs/remark-autolink-headings
- remark-stringify : https://github.com/remarkjs/remark/tree/HEAD/packages/remark-stringify
  - mdast To Markdown
- remark-gfm : https://github.com/remarkjs/remark-gfm
  - GitHub Flavored Markdown
- remark-lint : https://github.com/remarkjs/remark-lint
  - Markdown Lint

- https://github.com/rehypejs/awesome-rehype
- rehype-parse : https://github.com/rehypejs/rehype/tree/main/packages/rehype-parse
  - HTML To hast
- rehype-remark : https://github.com/rehypejs/rehype-remark
  - hast To mdast
- @agentofuser/rehype-section : https://github.com/agentofuser/rehype-section
  - Wrap `section`
- @mapboxrehype-prism : https://github.com/mapbox/rehype-prism
  - Prism.js
- rehype-highlight : https://github.com/rehypejs/rehype-highlight
  - Highlight.js
- rehype-document : https://github.com/rehypejs/rehype-document
  - Add `html`・`head`・`body`
- rehype-meta : https://github.com/rehypejs/rehype-meta
  - Add `meta`
- rehype-preset-minify : https://github.com/rehypejs/rehype-minify
  - HTML Minify
- rehype-autolink-headings : https://github.com/rehypejs/rehype-autolink-headings
  - `<h1 id="lorem"><a href="#lorem">Icon</a>Lorem</h1>`

- unified-stream : https://github.com/unifiedjs/unified-stream
  - `process.stdin.pipe(unifiedStream(processor)).pipe(process.stdout);`

 */
