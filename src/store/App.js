import { actions, model } from 'mirrorx';
import { $getJS, $with, } from '../core/ImmutableHelper'
import { fromJS } from "immutable";

export default model({
  name: 'app',
  initialState: fromJS({ counter: 0, init: 'welcome' }),
  reducers: {
    add(state) {
      let counter = $getJS(state, 'counter', 0) + 1;
      return $with(state).set('counter', counter).toState();
    }
  },
  effects: {
    async addClick() {
      actions.app.add();
    },
  },
});
