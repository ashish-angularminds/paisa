import { createFeature, createReducer, on } from "@ngrx/store";
import { initalStateInterface } from "./type/InitialState.interface";
import { authActions } from "./action";

const initalstate: initalStateInterface = {
  accounts: undefined,
  lastSMSUpdate: undefined,
  userToken: undefined
}

const authFeature = createFeature({
  name: 'store',
  reducer: createReducer(
    initalstate,
    on(authActions.setToken, (state, action) => ({
      ...state,
      userToken: action.token,
    })),
    on(authActions.deleteToken, (state) => ({
      ...state,
      userToken: undefined,
    }))
  )
});

export const { name: authFeatureKey, reducer: authReducer, selectUserToken } = authFeature