import { createStore } from 'redux'

const initialstate = {
  loadingBool: false,
}

const reducer = (state = initialstate, action) => {
  if (action.type === "SET_LOADING") {
    return {
      ...state,
      loadingBool: action.value
    }
  }

  return state
}

const Store = createStore(reducer)

export default Store