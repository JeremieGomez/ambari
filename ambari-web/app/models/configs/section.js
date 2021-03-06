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

var App = require('app');

App.Section = DS.Model.extend({
  id: DS.attr('string'),
  name: DS.attr('string'),
  displayName: DS.attr('string'),
  rowIndex: DS.attr('number', {defaultValue: 1}),
  rowSpan: DS.attr('number', {defaultValue: 1}),
  columnIndex: DS.attr('number', {defaultValue: 1}),
  columnSpan: DS.attr('number', {defaultValue: 1}),
  sectionColumns: DS.attr('number', {defaultValue: 1}),
  sectionRows: DS.attr('number', {defaultValue: 1}),
  subSections: DS.hasMany('App.SubSection'),
  tab: DS.belongsTo('App.Tab'),

  /**
   * Number of the errors in all subsections in the current section
   * @type {number}
   */
  errorsCount: function () {
    var errors = this.get('subSections').mapProperty('errorsCount');
    return errors.length ? errors.reduce(Em.sum) : 0;
  }.property('subSections.@each.errorsCount'),

  isFirstRow: function () {
    return this.get('rowIndex') == 0;
  }.property(),

  isMiddleRow: function () {
    return this.get('rowIndex') != 0 && (this.get('rowIndex') + this.get('rowSpan') < this.get('tab.rows'));
  }.property(),

  isLastRow: function () {
    return this.get('rowIndex') + this.get('rowSpan') == this.get('tab.rows');
  }.property(),

  isFirstColumn: function () {
    return this.get('columnIndex') == 0;
  }.property(),

  isMiddleColumn: function () {
    return this.get('columnIndex') != 0 && (this.get('columnIndex') + this.get('columnSpan') < this.get('tab.columns'));
  }.property(),

  isLastColumn: function () {
    return this.get('columnIndex') + this.get('columnSpan') == this.get('tab.columns');
  }.property()
});


App.Section.FIXTURES = [];

