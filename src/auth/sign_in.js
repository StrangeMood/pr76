import React, { Component } from 'react'
import PropTypes from 'prop-types'

import GoogleIcon from '../icons/google_logo.svg'

class SignIn extends Component {
  static propTypes = {
    onSignIn: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div className="sign-in">
        <h1 className="sign-in_project-name">PR76</h1>
        <button className="sign-in_google" onClick={this.props.onSignIn}>
          <GoogleIcon className="icon" />
          Signin with google
        </button>
      </div>
    )
  }
}

export default SignIn
