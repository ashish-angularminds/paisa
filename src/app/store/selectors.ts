import { createSelector } from "@ngrx/store";
import { initalStateInterface } from "./type/InitialState.interface";

export const selectFeature = (state: { auth: initalStateInterface }) => state.auth

export const selectUserToken = createSelector(
  selectFeature,
  (state) => state.userToken
)