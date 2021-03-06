import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { showLoginModal } from "../../redux/actions/modalActions";
import { signout } from "../../redux/actions/userActions";
import { Menu, Avatar, Row, Col, } from "antd";
import { UserOutlined, UserAddOutlined } from "@ant-design/icons";

const { SubMenu, Item } = Menu;

const Header = ({ user, signout, showLoginModal }) => {

  return (
    <Row gutter={24}>
      <Col span={24}>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Item>
            <Link to="/">HomePage</Link>
          </Item>
          <Item key="random">Header Stuff</Item>
          {!user && (
            <Item
              key="register"
              icon={<UserAddOutlined />}
              className="float-right"
            >
              <Link to="/register">Register</Link>
            </Item>
          )}

          {!user && (
            <Item onClick={() => showLoginModal()} key="login" icon={<UserOutlined />} className="float-right">
              <span >
                Login
              </span>
            </Item>
          )}
          {user ? (
            <SubMenu
              key="profile-menu"
              style={{ float: "right" }}
              title={
                <>
                  <Avatar icon={<UserOutlined />} /> {user.email}
                </>
              }
            >
              <Item key="profile">Profile</Item>
              <Item key="logout">
                <span onClick={() => signout()}>
                  Logout
                </span>
              </Item>
            </SubMenu>
          ) : null}
        </Menu>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps, { showLoginModal, signout })(Header);
