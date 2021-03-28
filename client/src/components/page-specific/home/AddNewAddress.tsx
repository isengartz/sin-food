import React from 'react';
import { Button, Form } from 'antd';
import UserAddressModal from '../../forms/user/RegisterForm/userAddressModal';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { selectUserAddressModal } from '../../../state';
import { useActions } from '../../../hooks/useActions';
import { UserAddress } from '../../../util/interfaces/UserAddress';

const AddNewAddress = () => {
  const addressModalIsVisible = useTypedSelector(selectUserAddressModal);
  const {
    showUserAddressModal,
    closeUserAddressModal,
    addUserAddress,
  } = useActions();
  return (
    <>
      <Button onClick={showUserAddressModal} type="primary">
        Add Address
      </Button>
      <Form.Provider
        onFormFinish={(name, { values, forms }) => {
          if (name === 'userAddressForm') {
            const addresses = {
              ...values,
              location: {
                coordinates: [values.longitude, values.latitude],
              },
            };
            addUserAddress(addresses as UserAddress);
            closeUserAddressModal();
          }
        }}
      >
        <UserAddressModal
          visible={addressModalIsVisible}
          onCancel={closeUserAddressModal}
        />
      </Form.Provider>
    </>
  );
};

export default AddNewAddress;
