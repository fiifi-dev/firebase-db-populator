import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import { getCurrentUser } from "../plugins/db";
import {
  AppComingSoon,
  AppHome,
  AppLogin,
  AppSignup,
  AppNotFound,
  AppOverview,
  AppAccount,
  AppDatabase,
} from "../views/index.js";

const routes = [
  {
    name: "comingsoon",
    path: "/comingsoon",
    component: AppComingSoon,
  },
  {
    name: "login",
    path: "/login",
    component: AppLogin,
  },
  {
    name: "signup",
    path: "/signup",
    component: AppSignup,
  },
  {
    path: "/",
    component: AppHome,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: "home",
        path: "",
        component: AppOverview,
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: "account",
        path: "/account",
        component: AppAccount,
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: "database",
        path: "/database",
        component: AppDatabase,
        meta: {
          requiresAuth: true,
        },
      },
      
    ],
  },
  {
    path: "*",
    component: AppNotFound,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !(await getCurrentUser())) {
    next("login");
  } else {
    next();
  }
});

// router.beforeEach(async (to, from, next) => {
//   const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
//   const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
//   const requiresModerator = to.matched.some(
//     (record) => record.meta.requiresModerator
//   );

//   let user = await getCurrentUser();
//   if ((requiresAuth || requiresModerator || requiresAdmin) && !user) {
//     next("login");
//   } else {
//     if (!requiresAuth && !requiresModerator && !requiresAdmin) {
//       next();
//     } else {
//       if (!user) {
//         next(false);
//       } else {
//         let claims = (await user.getIdTokenResult()).claims;
//         if (
//           (requiresModerator || requiresAdmin || requiresAuth) &&
//           claims.moderator
//         ) {
//           next();
//         } else if ((requiresAdmin || requiresAuth) && claims.admin) {
//           if (requiresModerator) {
//             next(false);
//           } else {
//             next();
//           }
//         } else if (requiresAuth) {
//           if (requiresModerator || requiresAdmin) {
//             next(false);
//           } else {
//             next();
//           }
//         } else {
//           next(false);
//         }
//       }
//     }
//   }
// });

export default router;
