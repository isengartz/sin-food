import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { Dispatch } from '@@/plugin-dva/connect';
import { MenuCategoryInterface } from '@/models/menu-categories';
import CategoriesDataTable from '@/pages/MenuCategory/components/CategoriesDataTable';
import Input from 'antd/lib/input';
import { Button } from 'antd';

interface MenuCategoryProps {
  dispatch: Dispatch;
  menu_categories: MenuCategoryInterface[];
  submitting?: boolean;
}
const Search = Input.Search;

const MenuCategory: React.FC<MenuCategoryProps> = ({ dispatch, menu_categories, submitting }) => {
  const [filters, setFilters] = useState<string>('');

  useEffect(() => {
    dispatch({
      type: 'menu_categories/getAll',
    });
  }, []);

  // Filters the categories that matches the filters
  // @todo: Should make this work for many different filters
  const categoriesFiltered = () => {
    if (!filters) return menu_categories;
    return menu_categories.filter(
      (category) => category.name.toLowerCase().indexOf(filters.toLowerCase()) >= 0,
    );
  };

  // @todo : Implement this as Modal
  const onAddNewCategory = () => {};

  const onItemEdit = (id: string) => {
    console.log('editing item', id);
  };

  return (
    <div>
      Menu Categories
      <div>
        <Search
          placeholder="Enter Title"
          onSearch={(value) => setFilters(value)}
          style={{ width: 200 }}
        />
        <Button type="primary" style={{ float: 'right' }} onClick={onAddNewCategory}>
          Add New Category
        </Button>
        <CategoriesDataTable
          onItemEdit={onItemEdit}
          onItemDelete={(id) =>
            dispatch({
              type: 'menu_categories/delete',
              payload: {
                id,
              },
            })
          }
          data={categoriesFiltered()}
        />
      </div>
    </div>
  );
};

export default connect(({ menu_categories, loading }: ConnectState) => ({
  menu_categories: menu_categories?.categories || [],
  submitting: loading.effects['menu_categories/create'],
}))(MenuCategory);
