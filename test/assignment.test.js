import test from 'node:test';
import assert from 'node:assert/strict';
import { assignmentOptions } from '../web/assignment.js';

test('Assignment dropdown lists added execution members with distinguishing details', () => {
  const state = { users: [{ id: 'owner', name: 'Owner' }, { id: 'staff', name: 'Same name', email: 'staff@example.test' }, { id: 'vendor', name: 'Same name', email: 'vendor@example.test' }, { id: 'customer', name: 'Customer' }, { id: 'other', name: 'Other project' }], members: [{ project: 'p', user: 'staff', role: 'staff', departments: ['Assembly', 'Testing'] }, { project: 'p', user: 'vendor', role: 'vendor', itemName: 'Motor' }, { project: 'p', user: 'customer', role: 'customer' }, { project: 'q', user: 'other', role: 'staff' }] };
  const list = assignmentOptions(state, 'p');
  assert.deepEqual(list.map(u => u.id), ['staff', 'vendor']);
  assert.match(list[0].name, /Assembly, Testing/); assert.match(list[0].name, /staff@example.test/);
  assert.match(list[1].name, /Vendor.*Motor.*vendor@example.test/);
  assert.deepEqual(assignmentOptions(state, 'empty'), []);
});
