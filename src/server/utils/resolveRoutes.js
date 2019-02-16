export default async (options) => {
  const routePromises = Object.keys(options.routes).map(async (path) => {
    if (['e404', 'e500', 'loading'].includes(path)) {
      return { path, Component: options.routes[path] };
    }
    if (typeof options.routes[path] === 'object') {
      const { loader, ...other } = options.routes[path];
      const module = await loader();
      return { path, component: module.default || module, exact: true, ...other };
    }

    const module = await options.routes[path]();
    return { path, exact: true, component: module.default || module };
  });
  const resolvedRoutes = await Promise.all(routePromises);
  const resolvedRouteMap = resolvedRoutes.reduce((routeMap, route) => {
    if (!['e404', 'e500', 'loading'].includes(route.path)) {
      const { path, ...finalOptions } = route;
      routeMap[route.path] = finalOptions;
    }
    return routeMap;
  }, {});

  return resolvedRouteMap;
};
