import React, { useEffect } from 'react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import {
  selectCurrentUser,
  selectCurrentUserAddressesFormatted,
} from '../../../state';
import { useActions } from '../../../hooks/useActions';
import DropDownWithButton from '../../layout/DropDownWithButton/dropDownWithButton';
import { Typography } from 'antd';
import AddNewAddress from './AddNewAddress';

const { Title, Paragraph } = Typography;

/**
 * Conditional Renders address dropdown or address Modal and the greetings
 * Based on user authorization status and if he set any address
 * @constructor
 */
const HomeUserAddressSection: React.FC = () => {
  const currentUser = useTypedSelector(selectCurrentUser);
  const userAddressesFormatted = useTypedSelector(
    selectCurrentUserAddressesFormatted,
  );
  const { getCurrentUserAddresses } = useActions();

  // If user is logged in and we have not fetch the addresses yet
  // Get all addresses from API
  // We use JSON stringify so we wont cause a rerender when the user Authentication check run

  useEffect(() => {
    currentUser && getCurrentUserAddresses(currentUser.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(currentUser), getCurrentUserAddresses]);

  const onBtnClick = (val: string | undefined) => {
    console.debug(val);
  };
  return (
    <>
      {currentUser ? (
        <>
          {userAddressesFormatted?.length > 0 ? (
            <>
              <Title style={{ color: 'white' }}>
                Welcome {currentUser.first_name}!<br /> What would you like
                today?!
              </Title>
              <DropDownWithButton
                options={userAddressesFormatted}
                onBtnClick={onBtnClick}
                buttonText="Order Now"
              />
              <Paragraph
                style={{ color: 'white', textAlign: 'center', margin: '5px' }}
              >
                Or <br /> <AddNewAddress />
              </Paragraph>
            </>
          ) : (
            <>
              <Title style={{ color: 'white' }}>
                Welcome {currentUser.first_name}!<br /> Please add an address!
              </Title>
              <AddNewAddress />
            </>
          )}
        </>
      ) : (
        <Title style={{ color: 'white' }}>
          Welcome !<br /> Please login or Register first!
        </Title>
      )}
    </>
  );
};

export default HomeUserAddressSection;
