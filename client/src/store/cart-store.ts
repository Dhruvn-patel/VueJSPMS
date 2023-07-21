const cart = window.localStorage.getItem('cart');
const cartCount = window.localStorage.getItem('cartCount');
const totalPay = window.localStorage.getItem('totalPay');
export const cartStore = {
  namespaced: true,
  state: {
    cart: cart ? JSON.parse(cart) : [],
    cartCount: cartCount ? parseInt(cartCount) : 0,
    totalPay: totalPay ? parseInt(totalPay) : 0,
  },
  getters: {
    addToCart(state: any) {
      return state.cart;
    },
    cartItems(state: any) {
      return state.cartCount;
    },
    cartTotal(state: any) {
      return state.totalPay;
    },
  },
  mutations: {
    addToCart(state: any, payload: any) {
      const found = state.cart.find((product: any) => product.id == payload.id);
      if (found) {
        found.quantity++;
        state.totalPay += found.price;
      } else {
        state.totalPay += payload.price;
        state.cart.push(payload);
        state.cartCount++;
      }
      // console.log('state.totalPay', state.totalPay);
    },

    removeFromCart(state: any, payload: any) {
      const index = state.cart
        .map((data: any) => {
          return data.id;
        })
        .indexOf(payload);
      const found = state.cart.find((product: any) => product.id == payload);
      if (index > -1) {
        state.totalPay -= found.price * found.quantity;
        state.cartCount -= 1;
        state.cart.splice(index, 1);
      }
    },
    increaseQty(state: any, payload: any) {
      const found = state.cart.find((product: any) => product.id == payload);
      found.quantity++;
      found.totalPrice = found.quantity * found.price;
      state.totalPay += found.price;
    },
    decreaseQty(state: any, payload: any) {
      const found = state.cart.find((product: any) => product.id == payload);
      found.quantity--;
      state.totalPay -= found.price;
      if (found.quantity <= 0) {
        const index = state.cart
          .map((data: any) => {
            return data.id;
          })
          .indexOf(payload);
        if (index > -1) {
          state.cartCount -= 1;
          state.cart.splice(index, 1);
        }
        return;
      }
    },
    /* store in localStorage */
    saveCart(state: any) {
      window.localStorage.setItem('cart', JSON.stringify(state.cart));
      window.localStorage.setItem('cartCount', state.cartCount);
      window.localStorage.setItem('totalPay', state.totalPay);
    },
  },
  actions: {
    ADD_CART(context: any, payload: any) {
      context.commit('addToCart', payload);
      context.commit('saveCart');
    },
    REMOVE_FROM_CART(context: any, payload: any) {
      context.commit('removeFromCart', payload);
      context.commit('saveCart');
    },
    INC(context: any, paylaod: any) {
      context.commit('increaseQty', paylaod);
      context.commit('saveCart');
    },
    DESC(context: any, paylaod: any) {
      context.commit('decreaseQty', paylaod);
      context.commit('saveCart');
    },
  },
};
