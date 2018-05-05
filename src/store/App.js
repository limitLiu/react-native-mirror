import { actions, model } from 'mirrorx';
import { $getJS, $with, } from '../core/ImmutableHelper'

export default model({
  name: 'app',
  initialState: { counter: 0, init: 'welcome' },
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
