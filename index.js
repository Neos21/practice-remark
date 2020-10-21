const fs = require('fs').promises;

const unified         = require('unified');
const remarkParse     = require('remark-parse');
const remarkRehype    = require('remark-rehype');
const rehypeStringify = require('rehype-stringify');

// rehype-parse     : HTML To hast
// rehype-remark    : hast To mdast
// remark-stringify : mdast To Markdown

// remark-toc : mdast -> Table of Contents
// remark-html
// remark-lint
// remark-preset-lint-markdown-style-guide
// unified-stream : process.stdin.pipe(unifiedStream(processor)).pipe(process.stdout);
// rehype-document
// rehype-format

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
    .use(rehypeStringify);  // hast To HTML
  
  const input = await fs.readFile('./index.md', 'utf-8');
  
  const result = await processor.process(input);
  const contents = result.contents;  // HTML Code
  console.log(contents);
}
