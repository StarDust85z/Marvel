import { configureStore } from '@reduxjs/toolkit'

import { apiSlice } from './features/api/apiSlice'
import chars from './features/api/charsSlice'

export default configureStore({
  reducer: {
    chars,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware)
})