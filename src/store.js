import { configureStore } from '@reduxjs/toolkit'

import { apiSlice } from './features/api/apiSlice'
import search from './features/api/charsSlice'

export default configureStore({
  reducer: {
    search,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware)
})