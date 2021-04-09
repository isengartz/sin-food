import React, { useEffect, useState } from 'react';
import { useActions } from '../../../hooks/useActions';
import { useQuery } from '../../../hooks/useQuery';
import { Checkbox, Col, Row } from 'antd';
import { ALL_CATEGORIES_CHECKBOX_VALUE } from '../../../util/constants';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { selectRestaurantCategories } from '../../../state';
import { useHistory } from 'react-router-dom';
import restaurant from '../../../apis/instances/restaurant';

/**
 * Returns a list with all Categories
 * @constructor
 */
const RestaurantCategoryList: React.FC = () => {
  const queryParams = useQuery();
  const history = useHistory();
  const [categoriesSelected, setCategoriesSelected] = useState([
    ALL_CATEGORIES_CHECKBOX_VALUE,
  ]);
  const { getRestaurantCategories, setRestaurantSearchFilters } = useActions();
  const restaurantCategories = useTypedSelector(selectRestaurantCategories);

  // Fetch Categories if they are not already set
  useEffect(() => {
    console.log(restaurantCategories);
    if (!restaurantCategories || restaurantCategories.length === 0) {
      getRestaurantCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getRestaurantCategories]);

  useEffect(() => {
    // Get categories from query params
    const categories =
      queryParams.get('categories') !== null
        ? queryParams.get('categories')!.split(',')
        : [];

    // Generate an array of all category ids
    const categoryIds = restaurantCategories.flatMap((x) => [x.id]);
    // Filter out any random category id given from user
    const validCategories = categories.filter((category) =>
      categoryIds.includes(category),
    );

    setCategoriesSelected(
      validCategories.length > 0
        ? validCategories
        : [ALL_CATEGORIES_CHECKBOX_VALUE],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (categoriesSelected.includes(ALL_CATEGORIES_CHECKBOX_VALUE)) {
      queryParams.delete('categories');
    } else {
      queryParams.set('categories', categoriesSelected.join(','));
    }
    history.push({ search: queryParams.toString() });
    setRestaurantSearchFilters({
      address: queryParams.get('address') || '',
      categories: queryParams.get('categories')
        ? queryParams.get('categories')!.split(',')
        : [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesSelected, history]);

  // Handles Categories checkbox clicks
  const onCategoryClick: React.MouseEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const target = event.target as HTMLInputElement;
    // If someone clicks the All Categories
    if (target.value === ALL_CATEGORIES_CHECKBOX_VALUE) {
      // If All categories is already selected do nothing
      if (categoriesSelected.includes(ALL_CATEGORIES_CHECKBOX_VALUE)) {
        return;
      }
      setCategoriesSelected([ALL_CATEGORIES_CHECKBOX_VALUE]);
    } else {
      // Add the new category and remove the All Categories choice
      const newCategories = [...categoriesSelected, target.value].filter(
        (val) => val !== ALL_CATEGORIES_CHECKBOX_VALUE,
      );
      setCategoriesSelected(newCategories);
    }
  };

  return (
    <div>
      <Checkbox.Group value={categoriesSelected}>
        <Row>
          <Col style={{ margin: '0.5rem' }} span={24}>
            <Checkbox
              onClick={onCategoryClick}
              defaultChecked
              value={ALL_CATEGORIES_CHECKBOX_VALUE}
            >
              All Categories
            </Checkbox>
          </Col>
          {restaurantCategories.map((category) => (
            <Col key={category.id} style={{ margin: '0.5rem' }} span={24}>
              <Checkbox onClick={onCategoryClick} value={category.id}>
                {category.name}
              </Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    </div>
  );
};

export default RestaurantCategoryList;
