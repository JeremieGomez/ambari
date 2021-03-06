/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:databases', 'DatabasesController', {
  needs: ['component:select-widget',
          'component:expander-widget',
          'adapter:database',
          'controller:tables',
          'controller:columns',
          'controller:open-queries'  ]
});

test('controller is initialized properly.', function () {
  expect(6);

  var controller = this.subject();

  ok(controller.get('baseUrl'), 'baseUrl was set to a truthy value.');
  ok(controller.get('tableSearchResults'), 'table search results collection was initialized.');
  ok(controller.get('tabs'), 'tabs collection was initialized.');
  equal(controller.get('tabs.length'), 2, 'tabs collection contains two tabs');
  equal(controller.get('tabs').objectAt(0).get('name'), Ember.I18n.t('titles.explorer'), 'first tab is database explorer.');
  equal(controller.get('tabs').objectAt(1).get('name'), Ember.I18n.t('titles.results'), 'second tab is search results');
});

test('setTablePageAvailability sets canGetNextPage true if given database hasNext flag is true.', function () {
  expect(1);

  var controller = this.subject();

  var database = Ember.Object.create( { hasNext: true } );

  controller.setTablePageAvailability(database);

  equal(database.get('canGetNextPage'), true);
});

test('setTablePageAvailability sets canGetNextPage true if given database has more loaded tables than the visible ones.', function () {
  expect(1);

  var controller = this.subject();

  var database = Ember.Object.create({
    tables: [1],
    visibleTables: []
  });

  controller.setTablePageAvailability(database);

  equal(database.get('canGetNextPage'), true);
});

test('setTablePageAvailability sets canGetNextPage falsy if given database hasNext flag is falsy and all loaded tables are visible.', function () {
  expect(1);

  var controller = this.subject();

  var database = Ember.Object.create({
    tables: [1],
    visibleTables: [1]
  });

  controller.setTablePageAvailability(database);

  ok(!database.get('canGetNextPage'));
});

test('setColumnPageAvailability sets canGetNextPage true if given table hasNext flag is true.', function () {
  expect(1);

  var controller = this.subject();

  var table = Ember.Object.create( { hasNext: true } );

  controller.setColumnPageAvailability(table);

  equal(table.get('canGetNextPage'), true);
});

test('setColumnPageAvailability sets canGetNextPage true if given table has more loaded columns than the visible ones.', function () {
  expect(1);

  var controller = this.subject();

  var table = Ember.Object.create({
    columns: [1],
    visibleColumns: []
  });

  controller.setColumnPageAvailability(table);

  equal(table.get('canGetNextPage'), true);
});

test('setColumnPageAvailability sets canGetNextPage true if given database hasNext flag is falsy and all loaded columns are visible.', function () {
  expect(1);

  var controller = this.subject();

  var table = Ember.Object.create({
    columns: [1],
    visibleColumns: [1]
  });

  controller.setColumnPageAvailability(table);

  ok(!table.get('canGetNextPage'));
});

test('getTables sets the visibleTables as the first page of tables if they are already loaded', function () {
  expect(2);

  var controller = this.subject();

  var database = Ember.Object.create({
    name: 'test_db',
    tables: [1, 2, 3]
  });

  controller.pushObject(database);
  controller.set('pageCount', 2);

  controller.send('getTables', 'test_db');

  equal(database.get('visibleTables.length'), controller.get('pageCount'), 'there are 2 visible tables out of 3.');
  equal(database.get('canGetNextPage'), true, 'user can get next tables page.');
});

test('getColumns sets the visibleColumns as the first page of columns if they are already loaded.', function () {
  expect(2);

  var controller = this.subject();

  var table = Ember.Object.create({
    name: 'test_table',
    columns: [1, 2, 3]
  });

  var database = Ember.Object.create({
    name: 'test_db',
    tables: [ table ],
    visibleTables: [ table ]
  });

  controller.set('pageCount', 2);

  controller.send('getColumns', 'test_table', database);

  equal(table.get('visibleColumns.length'), controller.get('pageCount'), 'there are 2 visible columns out of 3.');
  equal(table.get('canGetNextPage'), true, 'user can get next columns page.');
});

test('showMoreTables pushes more tables to visibleTables if there are still hidden tables loaded.', function () {
  expect(2);

  var controller = this.subject();

  var database = Ember.Object.create({
    name: 'test_db',
    tables: [1, 2, 3],
    visibleTables: [1]
  });

  controller.pushObject(database);
  controller.set('pageCount', 1);

  controller.send('showMoreTables', database);

  equal(database.get('visibleTables.length'), controller.get('pageCount') * 2, 'there are 2 visible tables out of 3.');
  equal(database.get('canGetNextPage'), true, 'user can get next tables page.');
});

test('showMoreColumns pushes more columns to visibleColumns if there are still hidden columns loaded.', function () {
  expect(2);

  var controller = this.subject();

  var table = Ember.Object.create({
    name: 'test_table',
    columns: [1, 2, 3],
    visibleColumns: [1]
  });

  var database = Ember.Object.create({
    name: 'test_db',
    tables: [ table ],
    visibleTables: [ table ]
  });

  controller.set('pageCount', 1);

  controller.send('showMoreColumns', table, database);

  equal(table.get('visibleColumns.length'), controller.get('pageCount') * 2, 'there are 2 visible columns out of 3.');
  equal(table.get('canGetNextPage'), true, 'user can get next columns page.');
});
