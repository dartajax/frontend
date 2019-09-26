import {
  create,
  collection,
  text,
} from 'ember-cli-page-object';

export default create({
  scope: '[data-test-curriculum-inventory-verification-preview-table8]',
  title: text('[data-test-title]'),
  table: {
    scope: 'table',
    headings: collection('thead tr th'),
    rows: collection('tbody tr', {
      id: text('td', {at: 0}),
      title: text('td', {at: 1}),
      count: text('td', {at: 2}),
    }),
  },
});
