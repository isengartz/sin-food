import React from 'react';
import { Spin } from 'antd';
import './Loader.less';
const Loader = () => {
  return (
    <div className="preloader">
      <Spin />
    </div>
  );
};

export default Loader;
