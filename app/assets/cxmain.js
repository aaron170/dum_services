require.config({
    baseUrl: "http://localhost:3009/js",
    paths: {
        'angular': '../assets/angular.min',
        'angularAMD': '../assets/angularAMD.min',        
    },
    waitSeconds: 0,
    shim: {
        "angular": {exports: "angular"},
        'angularAMD': ['angular'],
    },
    deps: ['cxapp'],
    urlArgs:"v=1.0",
    useMinified: false
});