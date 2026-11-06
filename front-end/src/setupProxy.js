const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function (app) {
    app.use(
        createProxyMiddleware("/exchange/koreaexim",{
            target: 'https://www.koreaexim.go.kr',
            changeOrigin: true
        })
    )

};
