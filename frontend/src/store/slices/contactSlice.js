import api from '@/services/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// Create a new contact
export const createContact = createAsyncThunk(
	'contacts/create',
	async (contactData, { rejectWithValue }) => {
		try {
			const response = await api.post('/api/contacts', contactData);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// Fetch all contacts
export const fetchContacts = createAsyncThunk(
	  'contacts/fetch',
	async (page = 1, { rejectWithValue }) => {
		try {
			const response = await api.get(`/api/contacts?page=${page}`);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// Slice definition
const contactSlice = createSlice({
	name: 'contacts',
	initialState: {
		contacts: [],
		loading: false,
		error: null,
		success: false,
		page: 1,
		lastPage: 1,
		hasMore: true,
	},
	reducers: {
		clearStatus: (state) => {
			state.success = false;
			state.error = null;
		},
		resetContacts: (state) => {
			state.contacts = [];
			state.page = 1;
			state.hasMore = true;
		},
	},
	extraReducers: (builder) => {
		builder
		// Fetch contacts
		.addCase(fetchContacts.pending, (state) => {
			state.loading = true;
			state.error = null;
		})
		.addCase(fetchContacts.fulfilled, (state, action) => {
			const { data, meta } = action.payload;

			// If first page, replace; otherwise append
			if (meta.current_page === 1) {
				state.contacts = data || [];
			} else {
				state.contacts = [...state.contacts, ...(data || [])];
			}

			// Update pagination info
			state.page = meta.current_page;
			state.lastPage = meta.last_page;
			state.hasMore = meta.current_page < meta.last_page;
			state.loading = false;
		})
		.addCase(fetchContacts.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})

		// Create contact
		.addCase(createContact.pending, (state) => {
			state.loading = true;
			state.success = false;
		})
		.addCase(createContact.fulfilled, (state, action) => {
			state.contacts.push(action.payload);
			state.loading = false;
			state.success = true;
		})
		.addCase(createContact.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		});
	},
});

export const { clearStatus, resetContacts} = contactSlice.actions;
export default contactSlice.reducer;
