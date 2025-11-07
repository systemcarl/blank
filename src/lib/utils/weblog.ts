import type { Options } from 'markdown-it';
import markdown from 'markdown-it';
import markdownFootnote from 'markdown-it-footnote';

type Tokens = Parameters<Renderer['renderToken']>[0];
type Renderer = typeof md.renderer;

const md = markdown({ html : true }).use(markdownFootnote);

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
  );
}

md.renderer.rules.heading_open = heading;
md.renderer.rules.link_open = link;
md.renderer.rules.footnote_ref = footnote;

export function renderArticle(markdown : string) {
  return md.render(markdown);
}
