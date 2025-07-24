import api from '@/services/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ✅ Fetch all pipelines (with stages)
export const fetchPipelines = createAsyncThunk(
	'pipelines/fetch',
	async () => {
		const response = await api.get('/api/pipelines');
		return response.data;
	}
);

// ✅ Slice
const pipelineSlice = createSlice({
	name: 'pipelines',
	initialState: {
		pipelines: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPipelines.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchPipelines.fulfilled, (state, action) => {
				state.pipelines = action.payload;
				state.loading = false;
			})
			.addCase(fetchPipelines.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default pipelineSlice.reducer;
