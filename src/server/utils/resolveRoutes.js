export default async (options) => {
  const routePromises = Object.keys(options.routes).map(async (path) => {
    if (['e404', 'e500', 'loading'].includes(path)) {
      return { path, Component: options.routes[path] };
    }
    const module = await options.routes[path]();
    return { path, Component: module.default || module };
  });
  const resolvedRoutes = await Promise.all(routePromises);
  const resolvedRouteMap = resolvedRoutes.reduce((routeMap, route) => {
    if (!['e404', 'e500', 'loading'].includes(route.path)) {
      routeMap[route.path] = route.Component;
    }
    return routeMap;
  }, {});

  return resolvedRouteMap;
};
