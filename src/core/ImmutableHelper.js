import _ from "lodash";
import { fromJS, List } from "immutable";

let arrayKeyRegex = /^([^\[]*)((\[((\d+)|(\*))])+)$/;

export function arrayKey(segment) {
  return arrayKeyRegex.exec(segment)
}

class Stack {
  _config = {};

  constructor(config) {
    this._config = config;
  }

  key() {
    let stack = this._config;
    let { key, } = stack;
    return (!key && stack.index !== undefined) ? stack.index : key;
  }

  type() {
    return this._config['type'];
  }

  index() {
    return this._config['index'];
  }

  instance() {
    return fromJS(this.type() === 'list' ? [] : {});
  }

  toString() {
    return JSON.stringify(this._config);
  }

  parent() {
    return this._config['parent'];
  }
}

export function arrayKeySegments(str) {
  let striped = _.trim(str, '[]');
  return striped.split('][');
}


export function $move(target, path, from, to) {
  return $update(target, path, (list = fromJS([])) => {
    let x = list.get(from);
    return list.delete(from).insert(to, x);
  });
}

function travel(target, path, callback) {
  let stacks = pathToStacks(path);
  let stack = stacks.shift();
  let nextKey = stack.key();

  if (nextKey === '*') {
    if (!List.isList(target)) {
      throw new Error(`error * for ${JSON.stringify(target.toJS())}`);
    }
    let skipStack = stacks.shift();
    return target.map((item, index) => {
      validateStackFor(item, skipStack);
      return callback(item, skipStack, [...stacks], index);
    });
  } else {
    validateStackFor(target, stack);
    return callback(target, stack, stacks);
  }
}

function getFor(target, path, defaultValue) {
  if (!target) return target;
  return travel(target, path, (item, prevStack, stacks) => {
    if (!item) {
      if (defaultValue) {
        return null;
      } else {
        item = prevStack.instance();
      }
    }
    let key = prevStack.key();
    let next = item.get ? item.get(key) : item[key];
    if (stacks.length === 0) {
      return next;
    } else {
      return getFor(next, stacks, defaultValue);
    }
  });
}

export function $getJS(target, path, defaultValue = null) {
  let result = $get(target, path, defaultValue);
  if (result && result.toJS) {
    return result.toJS();
  }
  return result;
}

export function $get(target, path, defaultValue = null) {
  let match = path.match(/\[\*]/ig);
  let depth = match ? match.length : 0;
  let result = getFor(target, path, defaultValue);
  if (!result) {
    return defaultValue;
  }
  result = depth > 0 ? result.flatten(depth) : result;
  return result || defaultValue;
}

export function pathToStacks(path) {
  let stacks = [];
  if (_.isString(path)) {
    let segments = path.split('.');
    _.forEach(segments, (segment, s) => {
      let arrKey = arrayKey(segment);
      if (arrKey) {
        let [, key, index] = arrKey;
        let arrayKeys = arrayKeySegments(index);
        if (key) {
          stacks.push(new Stack({
            type: 'list',
            key,
            parent: 'map',
          }))

        }
        arrayKeys.forEach((i, index) => {
          stacks.push(new Stack({
            type: index === (arrayKeys.length - 1) ? 'map' : 'list',
            index: i === '*' ? i : parseInt(i),
            //parent : (index=== 0 && !key ) ?'map' :'list',
            parent: 'list',
          }))
        });
      } else {
        stacks.push(new Stack({
          type: 'map',
          key: segment,
          parent: 'map',
        }))
      }
    });
  } else {
    stacks = path;
  }
  return stacks;
}

function validateStackFor(target, stack) {
  if (stack.parent() === 'list' && !List.isList(target)) {
    throw new Error(`error index [${stack.key()}] for Map : ${JSON.stringify(!target.toJS ? target : target.toJS())}`);
  }
  if (List.isList(target) && !(Number.isInteger(stack.key()))) {
    throw new Error(`error index [${stack.key()}] for List : ${JSON.stringify(!target.toJS ? target : target.toJS())}`);
  }
}

export function $update(target, path, updater) {
  try {
    return travel(target, path, (item, prevStack, stacks, index) => {
      //let indexedUpdater = (w)=> updater(w,index);
      let nextKey = prevStack.key();
      return stacks.length === 0 ? item.update(nextKey, updater) :
        item.update(nextKey, (what = prevStack.instance()) => {
          if (what === null) {
            what = prevStack.instance();
          }
          return $update(fromJS(what), stacks, updater);
        });
    });
  } catch (e) {
    console.log("$update error", target, path);
    throw e;
  }
}

export function $set(target, path, v) {
  return $update(target, path, () => v);
}

export function $merge(target, path, v) {
  return $update(target, path, (w = fromJS({})) => w.merge(v));
}

export function $delete(target, path) {
  return travel(target, path, (target, prevStack, stacks) => {
    let nextKey = prevStack.key();
    if (!target || !fromJS(target).has(nextKey)) return target;
    if (stacks.length === 0) {
      return target.delete(nextKey);
    } else {
      return target.update(nextKey, (what) => {
        return what ? $delete(what, stacks) : what;
      });
    }
  });
}

class Wrap {
  _state = null;

  constructor(state) {
    this._state = state;
  }

  get(...args) {
    return new Wrap($get(this._state, ...args));
  }

  set(...args) {
    return new Wrap($set(this._state, ...args));
  }

  update(...args) {
    return new Wrap($update(this._state, ...args));
  }

  delete(...args) {
    return new Wrap($delete(this._state, ...args));
  }

  getJS(...args) {
    return $getJS(this._state, ...args);
  }

  toState() {
    return this._state;
  }
}

export function $with(state, callback = null) {
  $wrapped = new Wrap(state);
  return callback ? callback($wrapped) : $wrapped;
}