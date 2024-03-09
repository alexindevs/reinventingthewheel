class Router {
    constructor() {
        this.routes = {
            GET: {},
            POST: {},
            PATCH: {},
            PUT: {},
            DELETE: {}
        };
    }

    get(path, handler) {
        this.routes.GET[path] = handler;
    }

    post(path, handler) {
        this.routes.POST[path] = handler;
    }

    put(path, handler) {
        this.routes.PUT[path] = handler;
    }

    delete(path, handler) {
        this.routes.DELETE[path] = handler;
    }

    handleRequest(req, res) {
        const { method, url } = req;
        const routeHandler = this.routes[method][url];

        if (routeHandler) {
            routeHandler(req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    }
}

module.exports = Router;