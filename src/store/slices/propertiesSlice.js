import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchProperties = createAsyncThunk('properties/fetch', async (filters = {})=>{
  const res = await api.get('/properties', { params: filters })
  return res.data.data
})

export const fetchFeaturedProperties = createAsyncThunk('properties/fetchFeatured', async ()=>{
  const res = await api.get('/properties/featured')
  return res.data.data
})

const slice = createSlice({
  name: 'properties',
  initialState: { list: [], featured: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder)=>{
    builder.addCase(fetchProperties.fulfilled, (state,action)=>{
      const payload = action.payload
      let list = Array.isArray(payload) ? payload : (payload.data || [])
      state.list = list
    })
    builder.addCase(fetchFeaturedProperties.fulfilled, (state,action)=>{
      const payload = action.payload
      let featured = Array.isArray(payload) ? payload : (payload.data || [])
      state.featured = featured
    })
  }
})

export default slice.reducer
