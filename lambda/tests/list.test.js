import * as λ from '../src';

test('reduce executes input reducer function that over each member of input array [b] to output single value a.', () => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const list = ['a', 'b', 'c'];
  expect(λ.reduce('start')(reducer)(list)).toBe('startabc');
  expect(λ.reduce('start')(reducer)(list)).toBe(λ.reduce('start', reducer, list));
});

test('reduceRight executes input reducer function that over each member of input array [b] to output single value a.', () => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const list = ['a', 'b', 'c'];
  expect(λ.reduceRight('start')(reducer)(list)).toBe('startcba');
});

test('reduceRight executes functions in reverse order to reduce.', () => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const list = ['a', 'b', 'c'];
  const reversedList = ['c', 'b', 'a'];
  expect(λ.reduceRight('start')(reducer)(list)).toBe(λ.reduce('start')(reducer)(reversedList));
  expect(λ.reduceRight('start')(reducer)(list)).toBe(λ.reduceRight('start', reducer, list));
});

test('map executes input mapper over each member of input array [a] to output new array [b].', () => {
  const mapper = a => a + 'm';
  const list = ['a', 'b', 'c'];
  expect(λ.map(mapper)(list)).toEqual(['am', 'bm', 'cm']);
  expect(λ.map(mapper)(list)).toEqual(λ.map(mapper, list));
});

test('filter executes input checker over each member of input array [a] to filter and output filtered new array [b].', () => {
  const list = [0, 1, 2, 3];
  expect(λ.filter(a => a > 1)(list)).toEqual([2, 3]);
  expect(λ.filter(a => a > 3)(list)).toEqual([]);
  expect(λ.filter(a => a > 1)(list)).toEqual(λ.filter(a => a > 1, list));
});

test('find executes input checker over each member of input array [a] and outputs the first array member that matches checker or undefined.', () => {
  const list = [0, 1, 2, 3];
  expect(λ.find(a => a > 1)(list)).toBe(2);
  expect(λ.find(a => a > 3)(list)).toBe(undefined);
  expect(λ.find(a => a > 1)(list)).toBe(λ.find(a => a > 1, list));
});

test('findIndex executes input checker over each member of input array [a] and outputs the index of first array member that matches checker or undefined.', () => {
  const list = [2, 3, 4];
  expect(λ.findIndex(a => a > 1)(list)).toBe(0);
  expect(λ.findIndex(a => a > 2)(list)).toBe(1);
  expect(λ.findIndex(a => a > 3)(list)).toBe(2);
  expect(λ.findIndex(a => a > 4)(list)).toBe(undefined);
  expect(λ.findIndex(a => a > 1)(list)).toBe(λ.findIndex(a => a > 1, list));
});

test('join outputs a string created by joining input array members with input separator.', () => {
  const list = [2, 3, 4];
  expect(λ.join('')(list)).toBe('234');
  expect(λ.join(' ')(list)).toBe('2 3 4');
  expect(λ.join(' and ')(list)).toBe('2 and 3 and 4');
  expect(λ.join()(list)).toBe('2,3,4');
  expect(λ.join('')(list)).toBe(λ.join('', list));
});

test('keysOf outputs array of string keys of input array or object.', () => {
  expect(λ.keysOf([2, 3, 4])).toEqual(['0', '1', '2']);
  expect(λ.keysOf({1: 2, 2: 3})).toEqual(['1', '2']);
});

test('entriesOf outputs array of arrays of string keys and raw values of input array or object.', () => {
  expect(λ.entriesOf([2, 3, 4])).toEqual([['0', 2], ['1', 3], ['2', 4]]);
  expect(λ.entriesOf({1: 2, 2: 3})).toEqual([['1', 2],['2', 3]]);
});

test('everyOf outputs true if every element of input array passes input checker function as true.', () => {
  expect(λ.everyOf(a => a > 1)([2, 3, 4])).toEqual(true);
  expect(λ.everyOf(a => a > 5)([2, 3, 4])).toEqual(false);
  expect(λ.everyOf(a => a > 1)([2, 3, 4])).toEqual(λ.everyOf(a => a > 1)([2, 3, 4]));
});

test('slice outputs selected array elements as an array based on input range.', () => {
  expect(λ.slice(2)(1)([1, 2, 3, 4, 5])).toEqual([2]);
  expect(λ.slice(2)(0)([1, 2, 3, 4, 5])).toEqual([1, 2]);
  expect(λ.slice(8)(4)([1, 2, 3, 4, 5])).toEqual([5]);
  expect(λ.slice(8)(7)([1, 2, 3, 4, 5])).toEqual([]);
  expect(λ.slice(2)(1)([1, 2, 3, 4, 5])).toEqual(λ.slice(2)(1)([1, 2, 3, 4, 5]));
});

test('some outputs true if any element of input array passes input checker function as true.', () => {
  expect(λ.someOf(a => a > 1)([2, 3, 4])).toEqual(true);
  expect(λ.someOf(a => a > 5)([2, 3, 4])).toEqual(false);
  expect(λ.someOf(a => a > 1)([2, 3, 4])).toEqual(λ.someOf(a => a > 1, [2, 3, 4]));
});