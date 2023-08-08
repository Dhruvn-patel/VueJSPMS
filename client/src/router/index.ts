import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Signin from '../pages/auth/signin.vue';
import Signup from '../pages/auth/signup.vue';
import Category from '../pages/admin-panel/category.vue';
import Users from '../pages/admin-panel/users.vue';
import Products from '../pages/admin-panel/products.vue';
import Dashboard from '../pages/admin-panel/dashboard.vue';
import HomePage from '../pages/home-page.vue';
import NotFound from '../pages/page-not-found/not-found.vue';
import OrderPage from '../pages/cart/order.vue';
import Cart from '../pages/cart/cart.vue';
import jwt_decode from 'jwt-decode';
import ForgetPassword from '../pages/auth/forget-password.vue';
import OrderHistory from '../pages/cart/orderhistory.vue';
import OTP from '../pages/auth/otp.vue';
function decodedata() {
  const token = localStorage.getItem('token') || '';
  if (!token) return null;
  console.log('token', token);
  const decoded: any = jwt_decode(token);
  localStorage.setItem(
    'loginUser',
    JSON.stringify({ userId: decoded.userId, isLogin: true }),
  );
  return decoded;
}
function guardMySign(to: any, from: any, next: any) {
  let isAuthenticated = false;
  if (
    localStorage.getItem('loginUser') != null &&
    localStorage.getItem('token') != null
  )
    isAuthenticated = true;
  else isAuthenticated = false;
  if (isAuthenticated) {
    // const decoded: any = decodedata();
    // if (decoded.roles === 1) next('/dashboard');
    // else
    // next('/home');
    next('/home');
  } else {
    next();
  }
}
function guardMyroute(to: any, from: any, next: any) {
  console.log(to, 'to');
  console.log(from, 'from');

  let isAuthenticated = false;

  if (
    localStorage.getItem('loginUser') != null &&
    localStorage.getItem('token') != null
  )
    isAuthenticated = true;
  else isAuthenticated = false;
  if (isAuthenticated) {
    next(); // allow to enter route
  } else {
    next('/login');
  }
}

function redirectBased(to: any, from: any, next: any) {
  const decoded: any = decodedata();
  if (decoded === null) return next('/login');
  if (decoded.roles === 1) next('/dashboard');
  else next('/home');
}
function ValidAdmin(to: any, from: any, next: any) {
  let isAuthenticated = false;
  if (
    localStorage.getItem('loginUser') != null &&
    localStorage.getItem('token') != null
  )
    isAuthenticated = true;
  else isAuthenticated = false;
  if (isAuthenticated) {
    // const decoded: any = decodedata();
    // if (decoded.roles === 1) next('/dashboard');
    // else
    // next('/home');
    next('/dashboard');
  } else {
    next();
  }
}
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'root',
    beforeEnter: redirectBased,
    component: NotFound,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    redirect: '/dashboard/users',
    component: Dashboard,
    beforeEnter: guardMyroute,
    children: [
      {
        name: 'users',
        path: '/dashboard/users',
        components: { admin: Users },
      },
      {
        name: 'products',
        path: '/products',
        components: { admin: Products },
      },
      { name: 'category', path: '/category', components: { admin: Category } },
    ],
  },
  {
    name: 'Login',
    path: '/login',
    component: Signin,
    beforeEnter: guardMySign,
  },
  {
    name: 'Register',
    path: '/register',
    component: Signup,
    beforeEnter: guardMySign,
  },
  {
    name: 'ForgetPassword',
    path: '/forgetpassword',
    component: ForgetPassword,
    // beforeEnter: guardMySign,
  },
  {
    name: 'ForgetPasswordOtp',
    path: '/forgetpassword/otp',
    component: OTP,
  },
  {
    name: 'Home',
    path: '/home',
    component: HomePage,
    beforeEnter: guardMyroute,
  },
  { name: 'Cart', path: '/cart', component: Cart, beforeEnter: guardMyroute },
  {
    name: 'order',
    path: '/order',
    component: OrderPage,
    beforeEnter: guardMyroute,
  },
  {
    name: 'orderHistory',
    path: '/orderhistory',
    component: OrderHistory,
    beforeEnter: guardMyroute,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
