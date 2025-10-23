import api from '@/services/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ✅ Create a new deal
export const createDeal = createAsyncThunk('deals/create', async (dealData, thunkAPI) => {
	const response = await api.post('/api/deals', dealData);
	return response.data.deal;
});

// ✅ Fetch all deals
export const fetchDeals = createAsyncThunk('deals/fetch', async () => {
	const response = await api.get('/api/deals');
	return response.data;
});

// ✅ Update deal stage (e.g., after drag-and-drop)
export const updateDealStage = createAsyncThunk(
	'deals/updateStage',
	async ({ id, stage_id }) => {
		const response = await api.patch(`/api/deals/${id}`, { stage_id });
		return response.data.deal;
	}
);

// ✅ Slice
const dealSlice = createSlice({
	name: 'deals',
	initialState: {
		deals: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Create deal
			.addCase(createDeal.fulfilled, (state, action) => {
				state.deals.push(action.payload);
			})

			// Fetch deals
			.addCase(fetchDeals.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchDeals.fulfilled, (state, action) => {
				state.deals = action.payload;
				state.loading = false;
			})
			.addCase(fetchDeals.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})

			// Update deal stage
			.addCase(updateDealStage.fulfilled, (state, action) => {
				const index = state.deals.findIndex(d => d.id === action.payload.id);
				if (index !== -1) {
					state.deals[index] = action.payload;
				}
			});
	},
});

export default dealSlice.reducer;
