import React from 'react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import {
  selectCurrentUserAddresses,
  selectOpenRestaurants,
  selectRestaurantFilters,
} from '../../../state';
import { useUpdateEffect } from '../../../hooks/useUpdateEffect';
import { useActions } from '../../../hooks/useActions';
import { useHistory } from 'react-router-dom';
import { RestaurantSearchFilters } from '../../../util/interfaces/RestaurantSearchFilters';
import queryString from 'query-string';
import RestaurantListItem from './RestaurantListItem/RestaurantListItem';
import { Col, Empty, Row } from 'antd';

/**
 * Returns a list with all restaurants matching the filters
 * @constructor
 */
const RestaurantList: React.FC = () => {
  const history = useHistory();
  const filters = useTypedSelector(selectRestaurantFilters);
  const openRestaurants = useTypedSelector(selectOpenRestaurants);
  const userAddresses = useTypedSelector(selectCurrentUserAddresses);
  const { searchRestaurants } = useActions();

  const handleSearchStores = (filters: RestaurantSearchFilters) => {
    if (!filters.address || !userAddresses || userAddresses.length === 0) {
      history.push('/');
    }
    // Check if address is a valid user address
    if (
      !userAddresses.flatMap((address) => address.id).includes(filters.address)
    ) {
      alert('not a valid address');
      return;
    }
    // Find the selected user address
    const addressObj = userAddresses.find(
      (address) => address.id === filters.address,
    );

    // Generate a query string from each filter and call searchRestaurants
    const [lng, lat] = addressObj!.location.coordinates;
    let filterQuery: any = {};
    //40.6095628,22.9522107
    filterQuery.latitude = lat;
    filterQuery.longitude = lng;
    if (filters.categories && filters.categories.length > 0) {
      filterQuery['categories[in]'] = filters.categories;
    }
    searchRestaurants(queryString.stringify(filterQuery));
  };

  // Run only on state update so we wont trigger an useless fetch when component mounts for first time
  useUpdateEffect(() => {
    handleSearchStores(filters);
  }, [filters]);

  return (
    <div style={{ marginTop: '1rem' }}>
      {openRestaurants && openRestaurants.length > 0 ? (
        openRestaurants.map((restaurant) => {
          return (
            <RestaurantListItem
              key={restaurant.id}
              id={restaurant.id}
              logo={restaurant.logo}
              minimum_order={restaurant.minimum_order}
              name={restaurant.name}
            />
          );
        })
      ) : (
        <Row gutter={[16, 16]} align="middle" justify="center">
          <Col>
            <Empty description="No Restaurant Found" />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default RestaurantList;
