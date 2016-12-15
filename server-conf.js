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

exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

exports.getLocations = function () {
    var requireInjector = requireConfigInjector();
    var babel = require('babel-core');
    var stylusParser = require('stylus');
    var projectPkgMetaData = require('./package.json');
    var babelHandlers = babelProcessor(babel, projectPkgMetaData.babel);

    var customHandlers = fis.serveRelease ? [] : [
        babelHandlers.babelHelper, babelHandlers.babel
    ];

    return [].concat(
        {
            location: /\/$/,
            handler: [
                home('index.html'),
                requireInjector,
                livereload()
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
