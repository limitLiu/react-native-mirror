import { actions, model } from 'mirrorx';
import { $getJS, $with, } from '../core/ImmutableHelper'
import { fromJS } from "immutable";
import { NativeModules } from 'react-native';
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
      let { RustManage } = NativeModules;
      if (RustManage) {
        let val = $getJS(state.app, 'counter', 0);
        let count = await RustManage.plus(val);
        actions.app.add({ count });
      }
    },
  },
});
