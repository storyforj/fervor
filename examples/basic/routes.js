// import AppRoot from './organisms/AppRoot';
// import Error404 from './apps/Error404';
// import Error500 from './apps/Error500';
import { About } from './apps/About';
import { PeopleApp, peopleQuery } from './apps/People';
import { ProfileApp, profileQuery, getProfileVariables } from './apps/Profile';

const routes = [
    { 
        path: '/',
        exact: true,
        component: PeopleApp,
        query: peopleQuery,
    },
    { 
        path: '/about',
        component: About,
    },
    {
        path: '/profile/:id',
        component: ProfileApp,
        query: profileQuery,
        getVars: getProfileVariables,
    },
];

export default routes;
