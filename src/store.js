import { applyMiddleware, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import history from './history'
import rootReducer from './root_reducer'

const middleware = applyMiddleware(
  thunk,
  routerMiddleware(history)
)
const store = createStore(rootReducer, composeWithDevTools(middleware))

if (module.hot) {
  module.hot.accept('./root_reducer', () => {
    store.replaceReducer(rootReducer)
  })
}

export default store
