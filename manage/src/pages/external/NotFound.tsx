import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';

// routes
import { PATH_DASHBOARD } from '../../routes/path';

const NotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Link to={PATH_DASHBOARD.root}>
          <Button type="primary">Back To Dashboard</Button>
        </Link>
      }
    />
  );
};

export default NotFound;
