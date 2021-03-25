import React, { useEffect } from 'react';
import { Typography } from 'antd';
import { Layout, Row, Col } from 'antd';
import '../assets/less/pages/home-page.less';
import DropDownWithButton from '../components/layout/DropDownWithButton/dropDownWithButton';
import { useTypedSelector } from '../hooks/useTypedSelector';
import {
  selectCurrentUser,
  selectCurrentUserAddressesFormatted,
} from '../state';
import { useActions } from '../hooks/useActions';

const { Content } = Layout;

const { Title } = Typography;

const HomePage: React.FC = () => {
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
    <Content>
      <div className="home-wrapper">
        <Row align="middle" justify="center">
          <Col span={8} style={{ marginTop: '10%' }} className="">
            {currentUser && (
              <>
                <Title style={{ color: 'white' }}>
                  Welcome {currentUser.first_name}!<br /> What would you like
                  today?!
                </Title>
                {userAddressesFormatted && (
                  <DropDownWithButton
                    options={userAddressesFormatted}
                    onBtnClick={onBtnClick}
                    buttonText="Order Now"
                  />
                )}
              </>
            )}
          </Col>
        </Row>
      </div>
    </Content>
  );
};

export default HomePage;
