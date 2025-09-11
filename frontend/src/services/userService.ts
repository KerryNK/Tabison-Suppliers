import api from '../api/client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    theme: 'light' | 'dark';
  };
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdateData {
  name?: string;
  phone?: string;
  avatar?: string;
  preferences?: Partial<UserProfile['preferences']>;
  address?: Partial<UserProfile['address']>;
}

class UserService {
  async getCurrentUser(): Promise<UserProfile> {
    try {
      const { data } = await api.get<UserProfile>('/users/me');
      return data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }

  async updateProfile(userData: UserUpdateData): Promise<UserProfile> {
    try {
      const { data } = await api.put<UserProfile>('/users/me', userData);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async updateAvatar(file: File): Promise<{ avatarUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await api.post<{ avatarUrl: string }>('/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  }

  async updateNotificationPreferences(preferences: Partial<UserProfile['preferences']>): Promise<UserProfile> {
    try {
      const { data } = await api.put<UserProfile>('/users/me/preferences', { preferences });
      return data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  async updateAddress(address: Partial<UserProfile['address']>): Promise<UserProfile> {
    try {
      const { data } = await api.put<UserProfile>('/users/me/address', { address });
      return data;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  async deleteAccount(): Promise<{ success: boolean }> {
    try {
      const { data } = await api.delete<{ success: boolean }>('/users/me');
      return data;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  // Admin-only methods
  async getAllUsers(params?: { page?: number; limit?: number; role?: string; search?: string }): Promise<{
    users: UserProfile[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const { data } = await api.get('/admin/users', { params });
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<UserProfile> {
    try {
      const { data } = await api.get(`/admin/users/${userId}`);
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUserRole(userId: string, role: string): Promise<UserProfile> {
    try {
      const { data } = await api.put(`/admin/users/${userId}/role`, { role });
      return data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  async deactivateUser(userId: string): Promise<{ success: boolean }> {
    try {
      const { data } = await api.post(`/admin/users/${userId}/deactivate`);
      return data;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  async reactivateUser(userId: string): Promise<{ success: boolean }> {
    try {
      const { data } = await api.post(`/admin/users/${userId}/reactivate`);
      return data;
    } catch (error) {
      console.error('Error reactivating user:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
export default userService;
