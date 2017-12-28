import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'

import history from './history'
import store from './store'

import Auth from './auth/auth'
import Map from './map/map'


export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Auth>
            <Switch />
            <Switch>
              <Map />
            </Switch>
          </Auth>
        </ConnectedRouter>
      </Provider>
    )
  }
}
