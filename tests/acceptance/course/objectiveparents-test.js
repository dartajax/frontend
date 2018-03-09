import {
  module,
  test
} from 'qunit';
import setupAuthentication from 'ilios/tests/helpers/setup-authentication';

import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import page from 'ilios/tests/pages/course';

module('Acceptance: Course - Objective Parents', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  hooks.beforeEach(async function () {
    this.user = await setupAuthentication();
    this.server.create('school');
    this.server.create('program');
    this.server.create('programYear', {
      programId: 1,
    });
    this.server.create('cohort', {
      programYearId: 1
    });
    server.create('competency', {
      schoolId: 1,
      programYearIds: [1],
    });
    server.create('competency', {
      schoolId: 1,
      programYearIds: [1],
    });
    server.create('objective', {
      programYearIds: [1],
      competencyId: 1
    });
    server.create('objective', {
      competencyId: 2,
      programYearIds: [1],
    });
    server.create('objective', {
      competencyId: 2,
      programYearIds: [1],
    });
    server.create('objective', {
      parentIds: [1]
    });
    server.create('objective');
    this.server.create('course', {
      year: 2013,
      schoolId: 1,
      objectiveIds: [4,5],
      cohortIds: [1]
    });
  });

  test('list parent objectives by competency', async function(assert) {
    assert.expect(19);

    await page.visit({ courseId: 1, details: true, courseObjectiveDetails: true });
    assert.equal(page.objectives.current().count, 2);

    assert.equal(page.objectives.current(0).description.text, 'objective 3');
    assert.equal(page.objectives.current(0).parents().count, 1);
    assert.equal(page.objectives.current(0).parents(0).description, 'objective 0');


    await page.objectives.current(0).manageParents();

    assert.equal(page.objectives.parentManager.title, 'objective 3');
    assert.equal(page.objectives.parentManager.groupTitle, 'Select Parent For: program 0 cohort 0');
    assert.equal(page.objectives.parentManager.competencies().count, 2);
    assert.equal(page.objectives.parentManager.competencies(0).title, 'competency 0');
    assert.ok(page.objectives.parentManager.competencies(0).selected);
    assert.equal(page.objectives.parentManager.competencies(0).objectives().count, 1);
    assert.equal(page.objectives.parentManager.competencies(0).objectives(0).title, 'objective 0');
    assert.ok(page.objectives.parentManager.competencies(0).objectives(0).selected);

    assert.equal(page.objectives.parentManager.competencies(1).title, 'competency 1');
    assert.ok(page.objectives.parentManager.competencies(1).notSelected);
    assert.equal(page.objectives.parentManager.competencies(1).objectives().count, 2);
    assert.equal(page.objectives.parentManager.competencies(1).objectives(0).title, 'objective 1');
    assert.ok(page.objectives.parentManager.competencies(1).objectives(0).notSelected);
    assert.equal(page.objectives.parentManager.competencies(1).objectives(1).title, 'objective 2');
    assert.ok(page.objectives.parentManager.competencies(1).objectives(1).notSelected);
  });

  test('save changes', async function(assert) {
    assert.expect(11);
    await page.visit({ courseId: 1, details: true, courseObjectiveDetails: true });
    assert.equal(page.objectives.current().count, 2);

    assert.equal(page.objectives.current(0).description.text, 'objective 3');
    assert.equal(page.objectives.current(0).parents().count, 1);
    assert.equal(page.objectives.current(0).parents(0).description, 'objective 0');


    await page.objectives.current(0).manageParents();

    assert.equal(page.objectives.parentManager.title, 'objective 3');
    assert.equal(page.objectives.parentManager.groupTitle, 'Select Parent For: program 0 cohort 0');
    await page.objectives.parentManager.competencies(1).objectives(0).add();
    assert.ok(page.objectives.parentManager.competencies(0).objectives(0).notSelected);
    assert.ok(page.objectives.parentManager.competencies(1).objectives(0).selected);
    await page.objectives.save();

    assert.equal(page.objectives.current(0).description.text, 'objective 3');
    assert.equal(page.objectives.current(0).parents().count, 1);
    assert.equal(page.objectives.current(0).parents(0).description, 'objective 1');

  });

  test('cancel changes', async function(assert) {
    assert.expect(11);
    await page.visit({ courseId: 1, details: true, courseObjectiveDetails: true });
    assert.equal(page.objectives.current().count, 2);

    assert.equal(page.objectives.current(0).description.text, 'objective 3');
    assert.equal(page.objectives.current(0).parents().count, 1);
    assert.equal(page.objectives.current(0).parents(0).description, 'objective 0');


    await page.objectives.current(0).manageParents();

    assert.equal(page.objectives.parentManager.title, 'objective 3');
    assert.equal(page.objectives.parentManager.groupTitle, 'Select Parent For: program 0 cohort 0');
    await page.objectives.parentManager.competencies(1).objectives(0).add();
    assert.ok(page.objectives.parentManager.competencies(0).objectives(0).notSelected);
    assert.ok(page.objectives.parentManager.competencies(1).objectives(0).selected);
    await page.objectives.cancel();

    assert.equal(page.objectives.current(0).description.text, 'objective 3');
    assert.equal(page.objectives.current(0).parents().count, 1);
    assert.equal(page.objectives.current(0).parents(0).description, 'objective 0');
  });
});
