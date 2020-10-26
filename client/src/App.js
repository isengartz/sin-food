import React from "react";
import { BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getCurrentUser, signInUser } from "./actions/userActions";
import "./assets/less/imports.less";
import { Layout } from "antd";
import LayoutHeader from "./components/Header/header";
import DisplayMessage from "./components/DisplayMessage/DisplayMessage";
import Routes from "./components/Routes/Routes";

const { Header, Footer } = Layout;
class App extends React.Component {
  componentDidMount() {

     // this.props.signInUser();

    // console.debug(test);
    this.props.getCurrentUser();
  }

  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Header>
            <LayoutHeader user={this.props.user} />
          </Header>
          <Routes />
          <Footer>Footer</Footer>
        </Layout>
        <DisplayMessage />
      </BrowserRouter>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps, {
  getCurrentUser,
  signInUser,
})(App);
