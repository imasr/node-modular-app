var ssl_middleware = (req, res, next) => {
    const isNotSecure =
        req.protocol !== "https" ||
        req.headers["x-forwarded-proto"] !== "https" ||
        !req.secure;

    let host = req.get("host");
    host = host.split(":")[0];
    let redirectCode = 301;
    console.log(req.get("host"), req.protocol, req.secure)
    if (isNotSecure && !ignoredHost(host)) {
        return res.redirect(redirectCode, `https://${req.get("host")}${req.url}`);
    }
    next();
};

var ignoredHost = host => {
    if (host == "localhost" || host == "127.0.0.1") {
        return true;
    } else {
        return false;
    }
};

module.exports = {
    ssl_middleware
};
