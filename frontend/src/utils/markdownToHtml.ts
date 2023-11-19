import { unified } from 'unified';
import markdown from 'remark-parse';
import html from 'remark-html';

export default async function markdownToHtml(markdownText: string) {
  const result = await unified()
    .use(markdown)
    .use(html)
    .process(markdownText);
  return result.toString();
}