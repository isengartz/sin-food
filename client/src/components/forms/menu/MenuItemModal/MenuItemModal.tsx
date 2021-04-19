/* eslint-disable react-hooks/exhaustive-deps */
import React, { FormEventHandler, useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  InputNumber,
  Modal,
  Row,
  Space,
  Typography,
} from 'antd';
import { useActions } from '../../../../hooks/useActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import {
  selectedSelectedMenuItemIngredients,
  selectMenuItemModal,
  selectSelectedMenuItem,
} from '../../../../state';
import { formatMoney } from '../../../../util/formatMoney';
import MenuItemFormVariations from './sub-elements/MenuItemFormVariations';
import { CartItemInterface } from '../../../../util/interfaces/CartItemInterface';
import MenuItemFormIngredients from './sub-elements/MenuItemFormIngredients';

const MenuItemModal: React.FC = () => {
  const { closeMenuItemModal } = useActions();
  const isVisible = useTypedSelector(selectMenuItemModal);
  const selectedItem = useTypedSelector(selectSelectedMenuItem);
  const ingredientPrices = useTypedSelector(
    selectedSelectedMenuItemIngredients,
  );
  const [formRef] = Form.useForm();
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [itemBasePrice, setItemBasePrice] = useState<number>(0);

  const initialState = {
    item: '',
    item_options: {
      excluded_ingredients: [],
      extra_ingredients: [],
      quantity: 1,
      variation: '',
    },
  };
  const [orderItem, setOrderItem] = useState<CartItemInterface>(initialState);

  const visible = isVisible && selectedItem !== null;

  const calculateCurrentPrice = () => {
    return (itemBasePrice + itemPrice) * orderItem.item_options.quantity;
  };

  // Initialize the State
  useEffect(() => {
    if (!selectedItem) return;

    setOrderItem(initialState);
    console.log(selectedItem);
    // Add the Base price based on variation or item basePrice
    if (selectedItem.variations && selectedItem.variations.length > 0) {
      setItemBasePrice(selectedItem.variations[0].price);
      setOrderItem((prevState) => ({
        item: selectedItem.id,
        item_options: {
          ...prevState.item_options,
          variation: selectedItem.variations[0].name,
        },
      }));
    } else {
      setItemBasePrice(selectedItem.base_price);
      setOrderItem((prevState) => ({
        ...prevState,
        item: selectedItem.id,
      }));
    }
  }, [selectedItem]);

  // Updates the itemPrice based on Ingredients Value
  useEffect(() => {
    const newPrice = orderItem.item_options.extra_ingredients.reduce(
      (acc, current) => {
        acc += ingredientPrices.get(current) || 0;
        return acc;
      },
      0,
    );
    setItemPrice(newPrice);
  }, [orderItem.item_options.extra_ingredients]);

  const onSubmit = (values: any) => {
    console.log(values);
  };

  const onFormChange: FormEventHandler<HTMLFormElement> = (event) => {
    const target = event.target as HTMLInputElement;

    if (target.name === 'excluded_ingredients') {
      handleMainIngredientChange(target.value);
      return;
    }

    if (target.name.includes('extra_ingredients-')) {
      handleExtraIngredientChange(target.value);
      return;
    }
  };

  /**
   * Updates the state when a main ingredient change
   * @param changedVal
   */
  const handleMainIngredientChange = (changedVal: string) => {
    let updatedArray: string[] = [];

    if (!orderItem.item_options.excluded_ingredients.includes(changedVal)) {
      updatedArray = [
        ...orderItem.item_options.excluded_ingredients,
        changedVal,
      ];
    } else {
      updatedArray = orderItem.item_options.excluded_ingredients.filter(
        (ingr) => ingr !== changedVal,
      );
    }

    setOrderItem((prevState) => ({
      ...prevState,
      item_options: {
        ...prevState.item_options,
        excluded_ingredients: updatedArray,
      },
    }));
  };

  /**
   * Updates the state when an extra_ingredient change
   * @param changedVal
   */
  const handleExtraIngredientChange = (changedVal: string) => {
    let updatedArray: string[] = [];

    if (!orderItem.item_options.extra_ingredients.includes(changedVal)) {
      updatedArray = [...orderItem.item_options.extra_ingredients, changedVal];
    } else {
      updatedArray = orderItem.item_options.extra_ingredients.filter(
        (ingr) => ingr !== changedVal,
      );
    }

    setOrderItem((prevState) => ({
      ...prevState,
      item_options: {
        ...prevState.item_options,
        extra_ingredients: updatedArray,
      },
    }));
  };

  /**
   * Updates the state when Variation Changes
   * @param name
   */
  const onVariationChange = (name: string) => {
    setItemBasePrice(
      // @ts-ignore
      selectedItem!.variations!.find((variation) => variation.name === name)
        .price,
    );
    setOrderItem((prevState) => ({
      ...prevState,
      item_options: {
        ...prevState.item_options,
        variation: name,
      },
    }));
  };

  return (
    <Modal
      visible={visible}
      onCancel={closeMenuItemModal}
      centered={true}
      footer={[
        <InputNumber
          name="quantity"
          key="input-number"
          min={1}
          value={orderItem.item_options.quantity}
          keyboard={true}
          defaultValue={1}
          style={{ float: 'left' }}
          onChange={(val) =>
            setOrderItem((prevState) => ({
              ...prevState,
              item_options: { ...prevState.item_options, quantity: val },
            }))
          }
        />,
        <Button key="submit" type="primary" onClick={formRef.submit}>
          Submit
        </Button>,
      ]}
    >
      <Form
        style={{ margin: '20px' }}
        form={formRef}
        name="menu_item_form"
        onFinish={onSubmit}
        onChange={onFormChange}
      >
        {selectedItem !== null && (
          <Row>
            {selectedItem.image && (
              <Col span={24}>
                <img src={selectedItem.image} alt="menu-item" />
              </Col>
            )}
            <Col span={24}>
              <Space direction="vertical">
                <Typography.Title level={3}>
                  {selectedItem.name}
                </Typography.Title>
                {selectedItem.description && (
                  <Typography.Text type="secondary">
                    {selectedItem.description}
                  </Typography.Text>
                )}
                <Typography.Paragraph>
                  {formatMoney(calculateCurrentPrice())}
                </Typography.Paragraph>
              </Space>
            </Col>
            <Space direction="vertical">
              {selectedItem.variations &&
                selectedItem.variations.length > 0 && (
                  <MenuItemFormVariations
                    onChange={onVariationChange}
                    value={orderItem.item_options.variation!}
                    selectedItem={selectedItem.variations[0].name}
                    variations={selectedItem.variations}
                    name="variation"
                  />
                )}

              {selectedItem.main_ingredients &&
                selectedItem.main_ingredients.length > 0 && (
                  <MenuItemFormIngredients
                    header="Ingredients"
                    items={selectedItem.main_ingredients}
                    inputName="excluded_ingredients"
                    showPrices={false}
                    // onChange={onMainIngredientChange}
                    value={selectedItem.main_ingredients
                      .flatMap((ingredient) => ingredient.id)
                      .filter(
                        (ingr) =>
                          !orderItem.item_options.excluded_ingredients.includes(
                            ingr,
                          ),
                      )}
                  />
                )}

              {selectedItem.extra_ingredient_groups &&
                selectedItem.extra_ingredient_groups.map((group) => (
                  <MenuItemFormIngredients
                    value={orderItem.item_options.extra_ingredients}
                    key={group.title}
                    inputName={`extra_ingredients-${group.title}`}
                    header={group.title}
                    items={group.ingredients}
                  />
                ))}
            </Space>
          </Row>
        )}
      </Form>
    </Modal>
  );
};

export default MenuItemModal;
