import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks
export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
	try {
		const res = await api.get('/api/user');
		return res.data;
	} catch (err) {
		return rejectWithValue(err.response?.data || 'Unauthenticated');
	}
});

export const login = createAsyncThunk('auth/login', async (credentials, { dispatch, rejectWithValue }) => {
	try {
		await api.get('/sanctum/csrf-cookie');
		await api.post('/api/login', credentials);
		return await dispatch(fetchUser()).unwrap();
	} catch (err) {
		return rejectWithValue(err.response?.data?.message || 'Login failed');
	}
});

export const logout = createAsyncThunk('auth/logout', async () => {
	await api.post('/api/logout');
});

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: null,
		loading: true,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUser.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchUser.fulfilled, (state, action) => {
				state.user = action.payload;
				state.loading = false;
			})
			.addCase(fetchUser.rejected, (state) => {
				state.user = null;
				state.loading = false;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.user = action.payload;
				state.error = null;
			})
			.addCase(login.rejected, (state, action) => {
				state.error = action.payload;
			})
			.addCase(logout.fulfilled, (state) => {
				state.user = null;
			});
	},
});

export default authSlice.reducer;
