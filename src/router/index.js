import Router from "vue-router";
import Vue from "vue";
import store from "../store";
import { DialogProgrammatic as Dialog } from "buefy";
// import { apolloClient } from "../apollo";
// import { LOGIN } from "@/graphql/auth";
// import { AUTH_SET } from "@/store/auth/types";

const HelloWorld = () => import("@/views/HelloWorld");
const Home = () => import("@/views/Home");
const Login = () => import("@/views/Login");
const Dash = () => import("@/components/layout/dash");
const NotFound = () => import("@/views/404");

// routes
import masterRoutes from "./master";
import userMgmtRoutes from "./user-management";
import edpRoutes from "./edp";
import admissionRoutes from "./admission";

Vue.use(Router);
// route.name should match 
const router = new Router({
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/",
      component: Dash,
      children: [
        {
          path: "",
          name: "home",
          component: Home
        },
        {
          path: "hello",
          component: HelloWorld,
          name: "Hello"
        },
        ...admissionRoutes,
        ...edpRoutes,
        ...userMgmtRoutes,
        ...masterRoutes,
      ],
    },
    {
      path: "*",
      name: "notfound",
      component: NotFound,
    },
  ],
  mode: "history",
  linkExactActiveClass: "is-active",
});

let remainingSeconds;
const publicPages = ["login","notfound","changepassword"]
router.beforeEach((to, from, next) => {
  if (
    publicPages.includes(to.name) 
  )
    return next();

  const routePrivilege = to.meta && to.meta.privilege;

  if (store.state.auth) {
    const { expiringIn } = store.state.auth;
    remainingSeconds = Math.floor((new Date(expiringIn) - new Date()) / 1000);
    const privileges = store.state.auth.privileges.split(",");
    // check if still authenticated
    if (remainingSeconds > 0) {
      // check if authorized
      if (
        !routePrivilege ||
        privileges.includes("admin") ||
        privileges.includes(routePrivilege)
      ) {
        return next();
      }
      // not authorized
      else {
        Dialog.alert({
          title:"Unauthorized",
          message: "access-denied",
          hasIcon: true,
          iconPack: "fas",
          icon: "exclamation-circle",
          type: "is-danger",
        });
        return next(false);
      }
    }
  }
  // if moving one route to another inside the app but isn't authorized to target route
  // if (from.name && from.name !== "login") {
  //   alert("access-denied");
  //   return next(false);
  // }

  next("login");
});

let reminder;
router.afterEach((to) => {
  console.log("After", to);
  if (
    !remainingSeconds ||
    to.name === "login" ||
    to.name === "notfound" ||
    to.name === "changepassword"
  )
    return;

  console.log("remainingSeconds", remainingSeconds);

  clearTimeout(reminder);
  reminder = setTimeout(() => {
    console.log("redirecting to login.....");
    // router.push("login");
  }, remainingSeconds * 1000);

  // confirm
  if (remainingSeconds < 10)
    Dialog.alert({
      message: "Stay Logged In?",
      onConfirm: () => {
        console.log("confirmed");
      },
    });
});

export default router;
