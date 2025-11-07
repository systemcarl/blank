import type { Options } from 'markdown-it';
import highlight from 'highlight.js';
import markdown from 'markdown-it';
import markdownFootnote from 'markdown-it-footnote';
import { logError } from './log';

highlight.configure({ classPrefix : 'text typography-code-' });

type Tokens = Parameters<Renderer['renderToken']>[0];
type Renderer = typeof md.renderer;

const md = markdown({
  html : true,
  highlight : function (str, lang) {
    if (lang && highlight.getLanguage(lang)) {
      try {
        return highlight.highlight(str, { language : lang }).value;
      } catch (err) { logError(err); }
    }
    return '';
  },
}).use(markdownFootnote);

const defaultInlineCodeRender = md.renderer.rules.code_inline;
const defaultBlockCodeRender = md.renderer.rules.code_block;
const defaultFencedCodeRender = md.renderer.rules.fence;
const defaultFootnoteRender = md.renderer.rules.footnote_ref;

function slug(text : string) {
  return text
    .toLowerCase()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w-]+/g, '');
}

function heading(
  tokens : Tokens,
  idx : number,
  options : Options,
  env : unknown,
  self : Renderer,
) {
  const level = tokens[idx]?.tag.replace('h', '');
  tokens[idx]?.attrPush(['class', `text typography-heading-${level}`]);
  tokens[idx]?.attrPush(['id', slug(tokens[idx + 1]?.content || '')]);
  return self.renderToken(tokens, idx, options);
}

function link(
  tokens : Tokens,
  idx : number,
  options : Options,
  env : unknown,
  self : Renderer,
) {
  tokens[idx]?.attrPush(['class', 'text typography-link']);
  return self.renderToken(tokens, idx, options);
}

function codeInline(
  tokens : Tokens,
  idx : number,
  options : Options,
  env : unknown,
  self : Renderer,
) {
  tokens[idx]?.attrPush(['class', 'text code typography-code']);
  return defaultInlineCodeRender
    ? defaultInlineCodeRender(tokens, idx, options, env, self)
    : '';
}

function codeBlock(
  tokens : Tokens,
  idx : number,
  options : Options,
  env : unknown,
  self : Renderer,
) {
  tokens[idx]?.attrPush(['class', 'text code-block typography-code']);
  return defaultBlockCodeRender
    ? defaultBlockCodeRender(tokens, idx, options, env, self)
    : '';
}

function codeFenced(
  tokens : Tokens,
  idx : number,
  options : Options,
  env : unknown,
  self : Renderer,
) {
  tokens[idx]?.attrPush(['class', 'text code-block typography-code']);
  return defaultFencedCodeRender
    ? defaultFencedCodeRender(tokens, idx, options, env, self)
    : '';
}

function footnote(
  tokens : Tokens,
  idx : number,
  options : Options,
  env : unknown,
  self : Renderer,
) {
  const rendered = defaultFootnoteRender
    ? defaultFootnoteRender(tokens, idx, options, env, self)
    : '';
  return rendered.replace(
    'class="footnote-ref"',
    'class="footnote-ref text typography-link typography-ref"',
  ).replace(/\[(\d+):\d+\]/g, '[$1]');
}

md.renderer.rules.heading_open = heading;
md.renderer.rules.link_open = link;
md.renderer.rules.code_inline = codeInline;
md.renderer.rules.code_block = codeBlock;
md.renderer.rules.fence = codeFenced;
md.renderer.rules.footnote_ref = footnote;

export function renderArticle(markdown : string) {
  return md.render(markdown);
}
