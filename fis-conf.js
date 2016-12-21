/**
 * @file fisx 编译的配置文件
 * @author ${#author#}
 */

var isProduction = fis.isProduction();
var prodReactFiles = [
    '/dep/react/dist/react.min.js',
    '/dep/react-dom/dist/react-dom.min.js'
];
var devReactFiles = [
    '/dep/react/dist/react.js',
    '/dep/react-dom/dist/react-dom.js'
];

fis.addIgnoreFiles([].concat(
    [
        '/dep/react/*',
        '/dep/react/lib/**',
        '/dep/react-dom/*',
        '/dep/react-dom/lib/**',
        '/dep/react/dist/react-with-*',
        '/dep/react-dom/dist/react-dom-server*',
        '/src/main.dev.js'
    ],
    isProduction ? devReactFiles : prodReactFiles
));

var pageFiles = ['index.html'];

// 初始化要编译的样式文件: 只处理页面引用的样式文件
fis.initProcessStyleFiles(pageFiles, require('./tool/stylus')());

// 启用相对路径
fis.match('index.html', {
    relative: true
}).match('*.js', {
    relative: true
}).match('*.css', {
    relative: true
});

// 启用 amd 模块编译
fis.hook('amd', {
    config: fis.getModuleConfig()
});

var babel = require('babel-core');

// babel compile react
fis.require('parser-babel6').parser = babel;
fis.match('/src/(**.js)', {
    parser: fis.plugin('babel6', {
        speed: true,
        sourceMaps: !isProduction
    }),
    preprocessor: [
        fis.plugin('babel'),
        fis.plugin('amd')
    ]
});

// 启用打包插件
fis.require('prepackager-babel').babel = babel;
fis.match('::package', {
    prepackager: fis.plugin('babel'),
    packager: fis.plugin('static', {
        // 内联 `require.config`
        inlineResourceConfig: true,
        page: {
            files: pageFiles,
            // 打包页面异步入口模块
            packAsync: {
                files: ['!/dep/**/*.js']
            }
        },
        bundles: [
            {
                files: isProduction ? prodReactFiles : devReactFiles,
                target: 'dep/vendor.js',
                preLoad: pageFiles
            }
        ]
    })
});
