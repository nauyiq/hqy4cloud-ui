export default [
  {
    path: "/",
    name: "HOME",
    component: () => import(/* webpackChunkName: "main" */ "../views/Home"),
    meta: {
      title: 'HOME'
    }
  },
  {
    path: "/index",
    name: "Index",
    component: () => import(/* webpackChunkName: "exhibit" */ "../views/Index"),
    meta: {
      title: 'HONGQY'
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
    path: "/chat",
    name: "Chat",
    component: () => import(/!* webpackChunkName: "article" *!/ "../views/Chat")
  },*/

  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "other" */ "../views/Login"),
    meta: {
      title: 'LOGIN'
    }
  },
 /* {
    path: "/account",
    name: "Account",
    component: () => import(/!* webpackChunkName: "other" *!/ "../views/UserInfo"),
    meta: {
      title: 'YOURSELF',
      requireAuth: true
    }
  },*/
]