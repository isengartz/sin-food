import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { getCurrentUser, signInUser } from './redux/actions/userActions'
import './assets/less/imports.less'
import { Layout } from 'antd'
import LayoutHeader from './components/Header/header'
import DisplayGlobalMessage from './components/DisplayGlobalMessage/DisplayGlobalMessage'
import Routes from './components/Routes/Routes'
import LoginForm from './components/User/LoginForm/loginForm'
import { selectUser } from './redux/selectors/user.selectors'
import { createStructuredSelector } from 'reselect'


const { Header, Footer } = Layout

class App extends React.Component {
  componentDidMount() {

    // this.props.signInUser();

    // console.debug(test);
    this.props.getCurrentUser()
  }

  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Header>
            <LayoutHeader user={this.props.user}/>
          </Header>
          <Routes/>
          <Footer style={{ position: 'sticky', bottom: '0' }}>Footer</Footer>

          {!this.props.user && (
            <LoginForm/>
          )}

        </Layout>
        <DisplayGlobalMessage />
      </BrowserRouter>
    )
  }
}


const mapStateToProps = createStructuredSelector({
  user: selectUser,
})

export default connect(mapStateToProps, {
  getCurrentUser,
  signInUser,
})(App)
