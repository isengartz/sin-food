/* eslint-disable react-hooks/exhaustive-deps */
import React, { FormEventHandler, useEffect, useState } from 'react';
import { useActions } from '../../../../hooks/useActions';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import {
  selectEditingMenuItem,
  selectedSelectedMenuItemIngredients,
  selectedSelectedMenuItemIngredientsNames,
  selectMenuIsLoading,
  selectMenuItemModal,
  selectSelectedMenuItem,
  selectSelectedRestaurant,
} from '../../../../state';
import { formatMoney } from '../../../../util/formatMoney';
import MenuItemFormVariations from './sub-elements/MenuItemFormVariations';
import {
  CartItemInterface,
  StoredCartItemInterface,
} from '../../../../util/interfaces/CartItemInterface';
import MenuItemFormIngredients from './sub-elements/MenuItemFormIngredients';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
  Typography,
} from 'antd';
import {
  ExtraGroupsInterfaces,
  IngredientInterface,
} from '../../../../util/interfaces/MenuItemInterface';

/**
 * Modal that handles adding a new item in cart
 * @constructor
 */
const MenuItemModal: React.FC = () => {
  const {
    closeMenuItemModal,
    addItemToCart,
    unsetMenuEditingItem,
    updateCartItem,
    unsetSelectedItem,
  } = useActions();
  const selectedRestaurant = useTypedSelector(selectSelectedRestaurant);
  const isVisible = useTypedSelector(selectMenuItemModal);
  const selectedItem = useTypedSelector(selectSelectedMenuItem);
  const editingItem = useTypedSelector(selectEditingMenuItem);
  const ingredientPrices = useTypedSelector(
    selectedSelectedMenuItemIngredients,
  );
  const ingredientNames = useTypedSelector(
    selectedSelectedMenuItemIngredientsNames,
  );
  const loading = useTypedSelector(selectMenuIsLoading);
  const [formRef] = Form.useForm();
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [itemBasePrice, setItemBasePrice] = useState<number>(0);

  const initialState = {
    item: '',
    uuid: '',
    item_options: {
      excluded_ingredients: [],
      extra_ingredients: [],
      quantity: 1,
      variation: '',
      comments: '',
      price: 0,
      name: '',
      description: '',
    },
  };
  const [orderItem, setOrderItem] = useState<CartItemInterface>(initialState);

  const visible = !loading && isVisible && selectedItem !== null;

  // Initialize the State. Runs only when selectedItem or editingItem changes
  useEffect(() => {
    if (!selectedItem) return;

    // Initialize state when we edit an item
    if (editingItem && !orderItem.item) {
      setOrderItem(editingItem);
      // Initialize the price based on variation or price
      if (editingItem.item_options.variation) {
        const variationPrice =
          selectedItem.variations.find(
            (variation) =>
              variation.name === editingItem.item_options.variation,
          )?.price || 0;
        setItemBasePrice(variationPrice);
      } else {
        setItemBasePrice(selectedItem.base_price);
      }
      return;
    }

    setOrderItem({
      ...initialState,
      item_options: { ...initialState.item_options, name: selectedItem.name },
    });

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
  }, [selectedItem, editingItem]);

  // Updates the itemPrice based on Ingredients Value
  // Triggers only when extra_ingredients or editing item state changes
  useEffect(() => {
    const newPrice = orderItem.item_options.extra_ingredients.reduce(
      (acc, current) => {
        acc += ingredientPrices.get(current) || 0;
        return acc;
      },
      0,
    );
    setItemPrice(newPrice);
  }, [orderItem.item_options.extra_ingredients, editingItem]);

  // Update items Description
  // Triggers when extra/excluded ingredients and variation changes
  useEffect(() => {
    if (!orderItem.item) return;

    const description = generateItemDescription();

    setOrderItem((prevState) => ({
      ...prevState,
      item_options: { ...prevState.item_options, description },
    }));
  }, [
    orderItem.item_options.extra_ingredients,
    orderItem.item_options.excluded_ingredients,
    orderItem.item_options.variation,
  ]);

  /**
   * Calculates current price of item
   */
  const calculateCurrentPrice = () => {
    // itemBasePrice = variation price or base price if item doesnt have a variation
    // itemPrice = price from extra ingredients
    return (itemBasePrice + itemPrice) * orderItem.item_options.quantity;
  };

  /**
   * Close Modal Event Handler
   */
  const modalCloseHandler = () => {
    if (editingItem) {
      unsetMenuEditingItem();
    }
    unsetSelectedItem();
    closeMenuItemModal();
    setOrderItem(initialState);
  };

  /**
   * Generates the item description based on variation and ingredients
   */
  const generateItemDescription = () => {
    let baseDescription = orderItem.item_options.variation
      ? `${orderItem.item_options.variation} `
      : '';
    const baseIngredients =
      selectedItem?.main_ingredients
        .flatMap((ingr: IngredientInterface) => ingr.id)
        .filter(
          (ingr: string) =>
            !orderItem.item_options.excluded_ingredients.includes(ingr),
        ) || [];
    const allIngredients = Array.from(
      new Set([
        ...baseIngredients,
        ...orderItem.item_options.extra_ingredients,
      ]),
    );

    const description = allIngredients
      .map((ingr) => ingredientNames.get(ingr) || '')
      .join(', ');

    return baseDescription + description;
  };

  /**
   * Handles Form Submission
   */
  const onSubmit = () => {
    // Calculate the final price and add it to cart item
    // We gonna recalculate the final price before order completion through API
    // So we dont care for user manipulation here. It just makes our life easier.
    const finalPrice = calculateCurrentPrice();
    const finalItemPayload = {
      ...orderItem,
      item_options: { ...orderItem.item_options, price: finalPrice },
    };

    if (editingItem) {
      unsetMenuEditingItem();
      updateCartItem(finalItemPayload as StoredCartItemInterface);
    } else {
      addItemToCart(finalItemPayload, selectedRestaurant!.id);
    }

    closeMenuItemModal();
    setOrderItem(initialState);
  };

  /**
   * Event Handler when any input of form changes
   * @param event
   */
  const onFormChange: FormEventHandler<HTMLFormElement> = (event) => {
    const target = event.target as HTMLInputElement;

    if (target.name === 'comments') {
      setOrderItem((prevState) => ({
        ...prevState,
        item_options: {
          ...prevState.item_options,
          comments: target.value,
        },
      }));
      return;
    }
    // For the next 2 I could possibly forward the formRef into child components and manually add the values to form

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
      onCancel={modalCloseHandler}
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
        layout="vertical"
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
                <Typography.Text strong>
                  {formatMoney(calculateCurrentPrice())}
                </Typography.Text>
              </Space>
              <Divider />
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
                      .flatMap(
                        (ingredient: IngredientInterface) => ingredient.id,
                      )
                      .filter(
                        (ingr: string) =>
                          !orderItem.item_options.excluded_ingredients.includes(
                            ingr,
                          ),
                      )}
                  />
                )}

              {selectedItem.extra_ingredient_groups &&
                selectedItem.extra_ingredient_groups.map(
                  (group: ExtraGroupsInterfaces) => (
                    <MenuItemFormIngredients
                      value={orderItem.item_options.extra_ingredients}
                      key={group.title}
                      inputName={`extra_ingredients-${group.title}`}
                      header={group.title}
                      items={group.ingredients}
                    />
                  ),
                )}

              <Col span={24}>
                <Form.Item label="Comments">
                  <Input.TextArea
                    name="comments"
                    rows={4}
                    placeholder="Any special instructions goes here..."
                  />
                </Form.Item>
              </Col>
            </Space>
          </Row>
        )}
      </Form>
    </Modal>
  );
};

export default MenuItemModal;
