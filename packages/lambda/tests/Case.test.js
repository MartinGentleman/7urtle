import * as λ from '../src';

test('Case.of() outputs instance of Case.', () => {
  expect(λ.Case.of() instanceof λ.Case).toBe(true);
});

test('Case.of([]).inspect() outputs string Case(a).', () => {
  expect(λ.Case.of([['_', '7turtle']]).inspect().includes('Case(function')).toBe(true);
});

test('Case.of({}).match(a) matches input a against map provided as input of Case.', () => {
  const types = {
    DISPATCH: 'DISPATCH'
  };
  const caseExpression = λ.Case.of([
    [1, 'one'],
    [types.DISPATCH, 'dispatch'],
    ['_', '7turtle']
  ]);
  expect(caseExpression.match(1)).toBe('one');
  expect(caseExpression.match(types.DISPATCH)).toBe('dispatch');
  expect(caseExpression.match(3)).toBe('7turtle');
  expect(λ.Case.of([]).match(1)).toBe(undefined);
  expect(λ.Case.of([[1, 'one']]).match(2)).toBe(undefined);
});

test('Case.of([]).map(a -> b) composes function over Case match function.', () => {
  expect(λ.Case.of([[1, '7turtle']]).map(a => a + 's').match(1)).toBe('7turtles');
});

test('Case.of([]).map(a -> Case) outputs Case(Case).', () => {
  expect(λ.Case.of([[1, '7turtle']]).map(a => λ.Case.of([[1, a + 's']])).match(1).match(1)).toBe('7turtles');
});

test('Case.of([]).flatMap(a -> Case) outputs SyncEffect.', () => {
  expect(λ.Case.of([['_', '7turtle']]).flatMap(a => λ.Case.of([['_', a + 's']])).match(1)).toBe('7turtles');
  expect(λ.Case.of([[1, 'I am']]).flatMap(a => λ.Case.of([[1, a + ' happy']])).match(1)).toBe('I am happy');
});