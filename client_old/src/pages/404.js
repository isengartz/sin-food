import React from 'react';
import { Result, Button } from 'antd';
const NotFoundPage = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="link" href="/">Back Home</Button>}
        />
    );
};

export default NotFoundPage;
