import api from '@/services/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const createDeal = createAsyncThunk(
  'deals/create',
  async (dealData, thunkAPI) => {
    const response = await api.post('/api/deals', dealData);
    return response.data.deal;
  }
);
