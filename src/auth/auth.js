import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { path } from 'ramda'

import { requestLogin, requestLogout, subscribeOnCurrentUserState } from './auth_actions'
import { currentUserSelector, isCheckingAuthSelector } from './auth_selectors'

class Auth extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    currentUser: PropTypes.object,
    isChecking: PropTypes.bool.isRequired,
    requestLogin: PropTypes.func.isRequired,
    requestLogout: PropTypes.func.isRequired,
    subscribeOnCurrentUserState: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.subscribeOnCurrentUserState()
  }

  onLogin = () => this.props.requestLogin()
  onLogout = () => this.props.requestLogout()

  render() {
    const { currentUser, isChecking } = this.props

    if (isChecking) return <div>CHECKING...</div>

    if (!currentUser) {
      return (
        <div>
          <div><button onClick={this.onLogin}>SIGN IN</button></div>
          {this.props.children[0]}
        </div>
      )
    }

    return (
      <div>
        <div className="auth-info">
          Logged in as: {currentUser.name}, <button onClick={this.onLogout}>LOG OUT</button>
        </div>
        {this.props.children[1]}
      </div>
    )
  }
}

export default connect(
  createStructuredSelector({
    currentUser: currentUserSelector,
    isChecking: isCheckingAuthSelector,
    key: path(['router', 'location', 'key']),
  }),
  { requestLogout, requestLogin, subscribeOnCurrentUserState }
)(Auth)
