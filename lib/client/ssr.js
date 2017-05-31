import KoaRouter from 'koa-router';
import PropTypes from 'prop-types';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import {
    matchPath,
    Switch,
    Route,
} from 'react-router-dom';

import Document from './components/Document';
import { createEnvironment } from './network';

class EnvironmentContext extends React.Component {
    getChildContext() {
        return { environment: this.props.environment };
    }
    render() {
        return <div>{ this.props.children }</div>;
    }
}
EnvironmentContext.childContextTypes = {
    environment: PropTypes.object,
};
EnvironmentContext.defaultProps = {
    environment: null,
};
EnvironmentContext.propTypes = {
    environment: PropTypes.object,
    children: PropTypes.element.isRequired,
};

export default (routes, Doc = Document) => {
    const App = ({ ctx }) => (
        <StaticRouter location={ctx.req.url} context={ctx}>
            <Switch>
                { routes.map((routeProps) => {
                    const p = Object.assign({}, routeProps);
                    delete p.query;
                    delete p.getVars;
                    return <Route key={p.path} {...p} />;
                })}
            </Switch>
        </StaticRouter>
    );

    App.propTypes = {
        ctx: PropTypes.object.isRequired,
    };

    const router = new KoaRouter();
    router.get('*', async (ctx) => {
        let rootQuery = '';
        let variables = {};
        routes.some((route) => {
            const match = matchPath(ctx.req.url, route);
            if (match) {
                rootQuery = route.query;
                if (route.getVars) {
                    variables = route.getVars(match);
                }
            }
            return match;
        });

        let environment;
        if (rootQuery) {
            environment = await createEnvironment(rootQuery, variables);
        }

        ctx.body = renderToString(
            (
                <Doc title={'Test'}>
                    <EnvironmentContext environment={environment}>
                        <App ctx={ctx} />
                    </EnvironmentContext>
                </Doc>
            ),
        );
    });

    return router.routes();
};
