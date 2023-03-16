export default [
  {
    path: "/index",
    name: "Index",
    component: () => import(/* webpackChunkName: "main" */ "../views/Index"),
    meta: {
      title: 'HONGQY'
    }
  },
  {
    path: "/",
    name: "HOME",
    component: () => import(/* webpackChunkName: "exhibit" */ "../views/Home"),
    meta: {
      title: 'HOME'
    }
  },
  {
    path: "/articles",
    name: "Articles",
    component: () => import(/* webpackChunkName: "article" */ "../views/Articles"),
    meta: {
      title: 'ARTICLES'
    }
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import(/* webpackChunkName: "article" */ "../views/Articles/detail"),
    meta: {
      title: 'DETAIL'
    }
  },
  {
    path: "/aboutMe",
    name: "AboutMe",
    component: () => import(/* webpackChunkName: "other" */ "../views/AboutMe"),
    meta: {
      title: 'ABOUT Me | HONGQY'
    }
  },
  /*{
    path: "/message",
    name: "Message",
    component: () => import(/!* webpackChunkName: "article" *!/ "../views/MessageBoard")
  },*/
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "other" */ "../views/Login"),
    meta: {
      title: 'LOGIN'
    }
  },
  {
    path: "/registry",
    name: "Registry",
    component: () => import(/* webpackChunkName: "other" */ "../views/Registry"),
    meta: {
      title: 'REGISTRY'
    }
  },
  {
    path: "/password/reset",
    name: "ForgetPassword",
    component: () => import(/* webpackChunkName: "other" */ "../views/ForgetPassword"),
    meta: {
      title: 'RESET | PASSWORD'
    }
  },
  {
    path: "/account",
    name: "Account",
    component: () => import(/* webpackChunkName: "other" */ "../views/UserInfo"),
    meta: {
      title: 'YOURSELF',
      requireAuth: true
    }
  },
]