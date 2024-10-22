import authService from "../services/auth.service"; //hit api
const user = JSON.parse(localStorage.getItem("user"));

const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return authService.login(user).then(
        (user) => {
          commit("loginSuccess", user);
          return Promise.resolve(user);
        },
        (error) => {
          commit("loginFailure");
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      authService.logout();
      commit("logout");
    },
    updateName({ commit }, name) {
      commit("updateName", name);
    },
    updateUserName({ commit }, username) {
      commit("updateUserName", username);
    }
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    updateName(state, name) {
      state.user.user.user_name = name;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    updateUserName(state, username) {
      state.user.user.username = username;
      localStorage.setItem("user", JSON.stringify(state.user));
    }
  },
};
