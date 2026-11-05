import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html = readFileSync('index.html', 'utf8');

test('DOM landmarks and skip link are properly structured', () => {
  // Skip link must exist right inside body
  assert.match(html, /<body[^>]*>[\s\S]*?<a[^>]*id="skipLink"[^>]*>/);
  assert.ok(html.includes('href="#mainContent"') && html.includes('class="skip-link"'));
  // Main landmark must have id="mainContent" and tabindex="-1"
  assert.match(html, /<main[^>]*id="mainContent"[^>]*tabindex="-1"[^>]*>/);
  // a11yStatus live region must exist with role="status" and aria-live="polite"
  assert.match(html, /<div[^>]*id="a11yStatus"[^>]*role="status"[^>]*aria-live="polite"[^>]*>/);
});

test('Interactive controls have accessible names', () => {
  // Extract all static buttons in index.html
  const buttonTags = [...html.matchAll(/<button([^>]*)>([\s\S]*?)<\/button>/gi)];
  assert.ok(buttonTags.length > 5, 'Found buttons in index.html');

  for (const b of buttonTags) {
    const attrs = b[1];
    const content = b[2].replace(/<[^>]*>/g, '').trim();
    const hasAria = /aria-label=["'][^"']+["']/.test(attrs);
    const hasTitle = /title=["'][^"']+["']/.test(attrs);
    const hasText = content.length > 0;
    assert.ok(hasAria || hasTitle || hasText, `Button missing accessible name: ${b[0].slice(0, 60)}`);
  }
});

test('SVG decorative icons are aria-hidden and non-focusable', () => {
  const svgs = [...html.matchAll(/<svg([^>]*)>/gi)].filter(m => !m[1].includes('icon-sprite'));
  for (const s of svgs) {
    assert.match(s[1], /aria-hidden=["']true["']/, `SVG missing aria-hidden="true": ${s[0]}`);
    assert.match(s[1], /focusable=["']false["']/, `SVG missing focusable="false": ${s[0]}`);
  }
});

test('Modal dialogs expose proper role and labeling', () => {
  assert.match(html, /id="detailScrim"[^>]*>[\s\S]*?<div[^>]*class="[^"]*detail-pane[^"]*"[^>]*role="dialog"[^>]*aria-modal="true"[^>]*aria-labelledby="detailTitle"/);
  assert.match(html, /id="editorScrim"[^>]*>[\s\S]*?<div[^>]*class="[^"]*editor-pane[^"]*"[^>]*role="dialog"[^>]*aria-modal="true"[^>]*aria-labelledby="editorTitle"/);
  assert.match(html, /id="backupScrim"[^>]*>[\s\S]*?<div[^>]*class="[^"]*backup-pane[^"]*"[^>]*role="dialog"[^>]*aria-modal="true"[^>]*aria-labelledby="backupTitle"/);
});

test('High contrast mode rules are defined in stylesheet', () => {
  const css = readFileSync('styles.css', 'utf8');
  assert.ok(css.includes('@media (forced-colors: active)'), 'Missing forced-colors: active rule in styles.css');
  assert.ok(css.includes('@media (prefers-contrast: more)'), 'Missing prefers-contrast: more rule in styles.css');
  assert.ok(css.includes('.skip-link:focus-visible'), 'Missing skip-link focus-visible rule');
});
