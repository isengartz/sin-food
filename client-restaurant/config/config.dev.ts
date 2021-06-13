// https://umijs.org/config/
import { defineConfig } from 'umi';
import dotenv from 'dotenv';

dotenv.config();
const { REACT_APP_ENV, REACT_APP_GOOGLE_MAPS_API_KEY } = process.env;
export default defineConfig({
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  define: {
    REACT_APP_ENV: REACT_APP_ENV || '',
    REACT_APP_GMAPS_API_KEY: REACT_APP_GOOGLE_MAPS_API_KEY || '',
  },
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  webpack5: {},
});
