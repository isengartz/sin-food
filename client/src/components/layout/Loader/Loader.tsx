import React from 'react';
import { Spin } from 'antd';
import './Loader.less';

/**
 * Full height Loader
 * @constructor
 */
const Loader = () => {
  return (
    <div className="preloader">
      <Spin />
    </div>
  );
};

export default Loader;
