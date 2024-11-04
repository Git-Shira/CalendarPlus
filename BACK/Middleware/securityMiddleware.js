class SecurityMiddleware {
    static secure() {
        return (req, res, next) => {
            try {
                this.checkInjections(req, next);
            } catch (e) {
                return res.send('Invalid request');
            }
        }
    }

    static checkInjections(req, next) {
        // Check for injection attacks in req.params
        for (let param in req.params) {
            if (req.params[param].includes('..')) {
                throw new Error('Invalid Request');
            }
        }

        // Check for injection attacks in req.query
        for (let query in req.query) {
            if (req.query[query].includes('..')) {
                throw new Error('Invalid Request');
            }
        }

        // Check for injection attacks in req.body (if applicable)
        if (req.body) {
            for (let bodyParam in req.body) {
                if (typeof req.body[bodyParam] === 'string' && req.body[bodyParam].includes('..')) {
                    throw new Error('Invalid Request');
                }
            }
        }

        return next();
    }
}

module.exports = SecurityMiddleware;