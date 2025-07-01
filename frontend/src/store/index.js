import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dealReducer from './slices/dealSlice';
import pipelineReducer from './slices/pipelineSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		deals: dealReducer,
		pipelines: pipelineReducer,
	},
});
