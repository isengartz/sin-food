const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              // "@primary-color": "#EE4539",
              // "@layout-header-background" : "#1d2528"
            },
            javascriptEnabled: true,
          },
        },
        // modifyLessRule: function (lessRule, _context) {
        //   lessRule.test = /\.(module)\.(less)$/;
        //   lessRule.exclude = /node_modules/;
        //
        //   return lessRule;
        // },
        // cssLoaderOptions: {
        //   modules: { localIdentName: '[local]_[hash:base64:5]' },
        // },
      },
    },
  ],
};
