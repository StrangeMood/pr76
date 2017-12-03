import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'

import history from './history'
import store from './store'

import Auth from './auth/auth'
import Projects from './projects/projects'
import ProjectWrapper from './project/project_wrapper'

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Auth>
            <Switch>
              <Route path="/:id" exact component={ProjectWrapper} />
            </Switch>
            <Switch>
              <Route path="/" exact component={Projects} />
              <Route path="/:id" exact component={ProjectWrapper} />
            </Switch>
          </Auth>
        </ConnectedRouter>
      </Provider>
    )
  }
}
