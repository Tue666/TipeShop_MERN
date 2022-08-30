import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';

// routes
import { PATH_DASHBOARD } from '../../routes/path';

const Denied = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Link to={PATH_DASHBOARD.root}>
          <Button type="primary">Back To Dashboard</Button>
        </Link>
      }
    />
  );
};

export default Denied;
