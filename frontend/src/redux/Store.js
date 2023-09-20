import { createStore } from 'redux'

const initialstate = {
  sellerOnBoardBool: false,
  existingSellerOnBoardBool: false,
  premiumFeatureBool: true,
  signInBool: false,
  signUpBool: false,
  loadingBool: false,
}

const reducer = (state = initialstate, action) => {
  if (action.type === "SET_LOADING") {
    return {
      ...state,
      loadingBool: action.value
    }
  }
  else if (action.type === "SET_SELLER_ON_BOARD") {
    return {
      ...state,
      sellerOnBoardBool: action.value
    }
  }
  else if (action.type === "SET_EXISTING_SELLER_ON_BOARD") {
    return {
      ...state,
      existingSellerOnBoardBool: action.value
    }
  }
  else if (action.type === "SET_PREMIUM_FEATURE") {
    return {
      ...state,
      premiumFeatureBool: action.value
    }
  }
  else if (action.type === "SET_SIGN_IN") {
    return {
      ...state,
      signInBool: action.value
    }
  }
  else if (action.type === "SET_SIGN_UP") {
    return {
      ...state,
      signUpBool: action.value
    }
  }

  return state
}

const Store = createStore(reducer)

export default Store