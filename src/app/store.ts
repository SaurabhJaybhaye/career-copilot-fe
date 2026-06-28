import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    // Placeholder reducer for future feature slices
    _placeholder: (state = {}) => state,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
