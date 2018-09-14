import NotFoundPage from "./pages/NotFoundPage";

export default function setRoute(router) {
  router.asyncRoute(
    "/",
    () => import(/* webpackChunkName: 'index' */ "./pages/IndexPage"),
    "IndexPage"
  );
  router.asyncRoute(
    "/news/:page?",
    () => import(/* webpackChunkName: 'news' */ "./pages/NewsPage"),
    "NewsPage"
  );
  router.asyncRoute(
    "/item/:itemId",
    () => import(/* webpackChunkName: 'item' */ "./pages/ItemPage"),
    "ItemPage"
  );
  router.asyncRoute(
    "/user/:userId",
    () => import(/* webpackChunkName: 'user' */ "./pages/UserPage"),
    "UserPage"
  );

  router.route("(.*)", NotFoundPage);
}
