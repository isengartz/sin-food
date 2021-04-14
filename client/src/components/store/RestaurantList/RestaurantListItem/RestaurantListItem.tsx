import { Row, Col, Skeleton, Typography } from 'antd';
import React from 'react';
import { RestaurantListItemInterface } from '../../../../util/interfaces/RestaurantListItemInterface';
import './restaurant-list-item.less';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { selectRestaurantSearchIsLoading } from '../../../../state';
import { Link } from 'react-router-dom';
import { formatMoney } from '../../../../util/formatMoney';

const { Text } = Typography;

interface RestaurantListItemProps extends RestaurantListItemInterface {}

const RestaurantListItem: React.FC<RestaurantListItemProps> = ({
  id,
  name,
  logo = 'https://via.placeholder.com/80x80',
  minimum_order,
}) => {
  const loading = useTypedSelector(selectRestaurantSearchIsLoading);

  return loading ? (
    <Row align="middle" gutter={[16, 16]} className="restaurant-list-item">
      <Skeleton loading={loading} active avatar />
      <Skeleton loading={loading} active avatar />
      <Skeleton loading={loading} active avatar />
    </Row>
  ) : (
    <Row className="restaurant-list-item" align="middle" gutter={[16, 16]}>
      <Link to={`/restaurant/${id}`}>
        <Col className="restaurant-list-item__image">
          <img alt={`${name}-logo`} src={logo} />
        </Col>
        <Col className="restaurant-list-item__content">
          <div className="restaurant-list-item__content-title">
            <Text strong>
              {name} - {id}
            </Text>
          </div>
          <div className="restaurant-list-item__content-min-order">
            <Text type="secondary">
              Min Order: {formatMoney(minimum_order)}
            </Text>
          </div>
        </Col>
      </Link>
    </Row>
  );
};

export default RestaurantListItem;
