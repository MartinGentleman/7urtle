import {deepInspect} from "./utils";
import {isNothing} from "./conditional";
import {nary} from "./arity";

/**
 * Maybe is one of the simplest and well known monads. In other languages or libraries it is also sometimes
 * called Option.
 *
 * Maybe expects a value as it's input. It is Nothing if the value is null, undefined, or empty. It returns
 * Just for all other cases.
 *
 * Maybe is called Maybe because it maybe holds a value. You want to use Maybe for situations when you don't
 * know whether there is going to be an output. It makes the situation very obvious and forces its consumers
 * to safely deal with it.
 *
 * @example
 * import {maybe, Maybe, upperCaseOf, liftA2} from '@7urtle/lambda';
 *
 * // in the example we randomly give Maybe a value or undefined. Maybe.of() outputs an instance of Maybe.
 * const myMaybe = Maybe.of(Math.random() > 0.5 ? 'random success' : undefined);
 *
 * // you could access the actual value like this
 * myMaybe.value; // => 'random success' or undefined
 *
 * // you can also inspect it by
 * myMaybe.inspect(); // => "Just('random success')" or "Nothing"
 *
 * // you can check if the value is Nothing
 * myMaybe.isNothing(); // => true or false
 * Maybe.of('abc').isNothing(); // => false
 * Maybe.of([]).isNothing(); // => true
 *
 * // you can check if the value is Just
 * myMaybe.isJust(); // => true or false
 * Maybe.of(123).isJust(); // => true
 * Maybe.of(null).isJust(); // => false
 *
 * // as a functor the value inside is safely mappable (map doesn't execute over Nothing)
 * myMaybe.map(value => upperCaseOf(value));
 * myMaybe.inspect(); // => "Just('RANDOM SUCCESS')" or "Nothing"
 *
 * // as a monad Maybe can be safely flat mapped with other Maybes (flatMap doesn't execute over Nothing)
 * Maybe.of(3).flatMap(a => Maybe.of(a + 2)).inspect(); // => 'Just(5)'
 * Maybe.of(3).flatMap(a => Maybe.of(null)).inspect(); // => 'Nothing'
 * Maybe.of(3).flatMap(a => a + 2); // => 5
 *
 * // as applicative functor you can apply functors to each other especially using liftA2 or liftA3
 * const add = a => b => a + b;
 * liftA2(add)(Maybe.of(2))(Maybe.of(3)); // => Just(5)
 * Maybe.of(1).map(add).ap(Maybe.of(2)).inspect(); // => 'Just(3)'
 * Maybe.of(1).map(add).ap(Maybe.of(null)).inspect(); // => 'Nothing'
 * Maybe.of(add).ap(Maybe.of(1)).ap(Maybe.of(2)).inspect(); // => 'Just(3)'
 *
 * // as an example you can use Maybe to help you work with DOM like this
 * Maybe.of(document.querySelector('#iexist')).map(a => a.offsetTop); // => Just(1240)
 * Maybe.of(document.querySelector('#idontexist')).map(a => a.offsetTop); // => Nothing
 * maybe('error: the object doesnt exist')(a => 'offset from top is ' + a)(Maybe.of(document.querySelector('#iexist')).map(a => a.offsetTop))
 */
export class Maybe {
  constructor(x) {
    this.value = x;
  }

  static of(x) {
    return isNothing(x) ? new Nothing(x) : new Just(x) ;
  }
}

class Just extends Maybe {
  inspect() {
    return `Just(${deepInspect(this.value)})`;
  }

  isNothing() {
    return false;
  }

  isJust() {
    return true;
  }

  map(fn) {
    return Maybe.of(fn(this.value));
  }

  flatMap(fn) {
    return fn(this.value);
  }

  ap(f) {
    return f.map(this.value);
  }
}

class Nothing extends Maybe {
  inspect () {
    return 'Nothing';
  }

  isNothing() {
    return true
  }

  isJust() {
    return false;
  }

  map(fn) {
    return this;
  }

  flatMap(fn) {
    return this;
  }

  ap(f) {
    return this;
  }
}

/**
 * maybe outputs result of a function onJust if input Maybe is Just or outputs input error if input Maybe is Nothing.
 *
 * maybe can be called both as a curried unary function or as a standard binary function.
 *
 * @HindleyMilner maybe :: a -> (b -> c) -> Maybe
 *
 * @pure
 * @param {*} a
 * @param {function} b
 * @return {Maybe}
 *
 * @example
 * import {maybe, Maybe} from '@7urtle/lambda';
 *
 * maybe('error')(a => a)(Maybe.of('abc')); // => 'abc'
 * maybe('error')(a => a)(Maybe.of(undefined)); // => 'error'
 * maybe('error')(a => a)(Maybe.of(undefined)) === Maybe.of(undefined).isNothing() ? 'error' ? 'not error';
 *
 * // maybe can be called both as a curried unary function or as a standard binary function
 * maybe('error')(a => a)(Maybe.of('abc')) === maybe('error', a => a, Maybe.of('abc'));
 */
export const maybe = nary(error => onJust => functorMaybe =>
  functorMaybe.isNothing()
    ? error
    : onJust(functorMaybe.value));