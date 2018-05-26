import { actions, model } from 'mirrorx';
import { $getJS, $with, } from '../core/ImmutableHelper'
import { fromJS } from "immutable";
import { RustManage } from '../core/natives';
import { getState } from "../mirror/middleware";

export default model({
  name: 'app',
  initialState: fromJS({ counter: 0, init: 'welcome', rand_str: '' }),
  reducers: {
    add(state, { count }) {
      return $with(state).set('counter', count).toState();
    },
    show_str(state, { rand_str }) {
      return $with(state).set('rand_str', rand_str).toState();
    },
  },
  effects: {
    async addClick() {
      let state = getState();
      let val = $getJS(state.app, 'counter', 0);
      let count = await RustManage.plus(val);
      actions.app.add({ count });
    },
    async initial() {
      let rand_str = await RustManage.test_rust();
      actions.app.show_str({ rand_str });
    },
  },
});
