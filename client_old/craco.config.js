const CracoLessPlugin = require("craco-less");

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
        // cssLoaderOptions: {
        //   modules: { localIdentName: "[local]_[hash:base64:5]" },
        // },
      },
    },
  ],
};
