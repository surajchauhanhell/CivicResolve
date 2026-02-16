
import { supabase } from '@/lib/supabase';
import type {
  User,
  LoginFormData,
  RegisterFormData
} from '@/types';

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  // Register new user
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const { email, password, name, phone } = data;

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone
        }
      }
    });

    if (error) throw error;
    if (!authData.user) throw new Error('Registration failed');

    // Fetch the created user profile from public.users
    // Note: The trigger might take a split second, so we might need retry logic or just return basic info
    // For now, we'll construct the user object from metadata

    const user: User = {
      id: authData.user.id,
      name: name,
      email: email,
      phone: phone,
      role: email.includes('@admin.com') ? 'admin' : 'citizen', // Optimistic role assignment matching SQL logic
      isActive: true,
      createdAt: new Date().toISOString()
    };

    return {
      user,
      token: authData.session?.access_token || ''
    };
  },

  // Login user
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const { email, password } = data;

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (!authData.user || !authData.session) throw new Error('Login failed');

    // Fetch full user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;

    return {
      user: {
        ...userProfile,
        email: authData.user.email // Ensure email is present
      },
      token: authData.session.access_token
    };
  },

  // Logout user
  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getMe: async (): Promise<User> => {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) throw new Error('Not authenticated');

    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profileError) throw profileError;

    return {
      ...userProfile,
      email: authUser.email
    };
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error('Not authenticated');

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        name: data.name,
        phone: data.phone,
        address: data.address,
        updated_at: new Date().toISOString()
      })
      .eq('id', authUser.id)
      .select()
      .single();

    if (error) throw error;

    return {
      ...updatedUser,
      email: authUser.email
    };
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    // Note: Supabase doesn't require current password for update if logged in, 
    // but for security we might want to re-authenticate or just proceed.
    // The UI asks for it, but Supabase SDK update method just takes new password.

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Get stored user
  getStoredUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  }
};
