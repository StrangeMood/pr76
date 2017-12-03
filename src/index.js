import React from 'react'
import ReactDOM from 'react-dom'

import { AppContainer } from 'react-hot-loader'

import 'sanitize.css'
import './styles/app.sass'

import './firebase'

import App from './app'

function render() {
  const container = document.getElementById('app')
  ReactDOM.render(
    <AppContainer><App /></AppContainer>,
    container
  )
}

render()

if (module.hot) {
  module.hot.accept('./app', () => render())
}
