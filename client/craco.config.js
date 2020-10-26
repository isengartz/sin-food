const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#1DA57A" },
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
