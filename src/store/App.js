import { actions, model } from 'mirrorx';
import { $getJS, $with, } from '../core/ImmutableHelper'
import { fromJS } from "immutable";
import { RustManage } from '../core/natives';
import { getState } from "../mirror/middleware";

export default model({
  name: 'app',
  initialState: fromJS({ counter: 0, init: 'welcome' }),
  reducers: {
    add(state, { count }) {
      return $with(state).set('counter', count).toState();
    }
  },
  effects: {
    async addClick() {
      let state = getState();
      let val = $getJS(state.app, 'counter', 0);
      let count = await RustManage.plus(val);
      console.log(await RustManage.test_rust("test"));
      actions.app.add({ count });
    },
  },
});
