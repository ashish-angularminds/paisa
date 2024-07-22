import { createAction, createActionGroup, emptyProps, props } from "@ngrx/store";

export const authActions = createActionGroup({
  source: "auth",
  events: {
    setToken: props<{ token: string }>(),
    deleteToken: emptyProps(),
  }
})