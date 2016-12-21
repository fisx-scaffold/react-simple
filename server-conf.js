/**
 * @file 本地 web server 配置文件，更多信息见如下链接：
 *       https://github.com/ecomfe/edp-webserver
 *       https://github.com/wuhy/autoresponse
 *
 *       TIP:
 *       1) 以发布目录进行调试查看，同时支持修改浏览器自动刷新命令：
 *          fisx release -wL
 *          fisx server start --release
 * @author ${#author#}
 */

/* global redirect:false */
/* global content:false */
/* global empty:false */
/* global home:false */
/* global autoless:false */
/* global html2js:false */
/* global file:false */
/* global less:false */
/* global stylus:false */
/* global livereload:false */
/* global php:false */
/* global proxyNoneExists:false */
/* global requireConfigInjector:false */
/* global autoresponse:false */
/* global babelProcessor:false */
/* global reactProcessor:false */
/* global cjs2amd:false */

exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

exports.getLocations = function () {
    var requireInjector = requireConfigInjector();
    var stylusParser = require('stylus');
    var babelHandlers = babelProcessor({
        enableReactHMR: !fis.serveRelease
    });
    var reactHandlers = reactProcessor();

    var customHandlers = fis.serveRelease ? [] : [
        reactHandlers.hmr,
        babelHandlers.babelHelper, babelHandlers.babel
    ];
    return [].concat(
        {
            location: /\/$/,
            handler: [
                home('index.html'),
                requireInjector
            ]
        },
        {
            location: /\.less($|\?)/,
            handler: [
                file(),
                less()
            ]
        },
        {
            location: /\.styl($|\?)/,
            handler: [
                file(),
                stylus(
                    require('./tool/stylus')(stylusParser, true)
                )
            ]
        },

        {
            location: /\/src\/main\.js/,
            handler: [
                function (context) {
                    var fs = require('fs');
                    var mainFile = require.resolve('./src/main.dev');
                    context.content = fs.readFileSync(mainFile);
                },
                babelHandlers.processESFile,
                cjs2amd
            ]
        },

        customHandlers,

        // 添加 mock 处理器
        autoresponse('edp', {
            logLevel: 'debug',
            root: __dirname,
            handlers: requireInjector,
            post: true
        }),

        {
            location: /^.*$/,
            handler: [
                file(),
                requireInjector,
                proxyNoneExists()
            ]
        }
    );
};

exports.injectRes = function (res) {
    for (var key in res) {
        if (res.hasOwnProperty(key)) {
            global[key] = res[key];
        }
    }
};

// disable watchreload setting false
exports.watchreload = {
    hmr: {
        entry: 'dev/react-hot-loader.js'
    },
    logLevel: 'debug',
    fileTypes: {
        script: 'js,vue'
    }
};
