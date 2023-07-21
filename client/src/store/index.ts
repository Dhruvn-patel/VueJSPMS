import { createStore } from 'vuex';
import { cartStore } from './cart-store';

const store = createStore({
  modules: {
    cartModule: cartStore,
  },
  state() {
    return {
      isAuthLogin: false,
    };
  },
  getters: {
    isLogin(state: any) {
      if (localStorage.getItem('loginUser') != null) {
        state.isAuthLogin = JSON.parse(
          localStorage.getItem('loginUser') || '',
        ).isLogin;
      }
      return state.isAuthLogin;
    },
  },
  mutations: {
    LogOutFunction(context: any) {
      context.commit('LOG_OUT_FUNCTION');
    },
    ToogleFunction(context: any) {
      context.commit('TOOGLE_STATE');
    },
  },
  actions: {
    LOG_OUT_FUNCTION(state: any) {
      state.isAuthLogin = !state.isAuthLogin;
      localStorage.clear();
      console.log(state.isAuthLogin, 'islogin');
    },
    TOOGLE_STATE(state: any) {
      state.isAuthLogin = !state.isAuthLogin;
    },
  },
});

export default store;
