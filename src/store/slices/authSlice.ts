
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';
import { firebaseService } from '../../services/api';

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }) => {
    return await firebaseService.signIn(email, password);
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ 
    email, 
    password, 
    role, 
    orgName, 
    state 
  }: { 
    email: string; 
    password: string; 
    role: string; 
    orgName: string; 
    state: string;
  }) => {
    return await firebaseService.signUp(email, password, role, orgName, state);
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async () => {
    await firebaseService.signOut();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // For demo purposes, set a mock user
    setMockUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to sign in';
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to sign up';
      })
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to sign out';
      });
  },
});

export const { clearError, setMockUser } = authSlice.actions;
export default authSlice.reducer;
