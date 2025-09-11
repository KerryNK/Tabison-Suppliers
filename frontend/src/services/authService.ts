import api from '../api/client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  token: string;
}

export interface OTPVerification {
  phone: string;
  code: string;
}

class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', credentials);
      this.setToken(data.token);
      this.setUser(data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', userData);
      this.setToken(data.token);
      this.setUser(data.user);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      const { data } = await api.get<AuthResponse>('/auth/google');
      this.setToken(data.token);
      this.setUser(data.user);
      return data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  async loginWithApple(): Promise<AuthResponse> {
    try {
      const { data } = await api.get<AuthResponse>('/auth/apple');
      this.setToken(data.token);
      this.setUser(data.user);
      return data;
    } catch (error) {
      console.error('Apple login error:', error);
      throw error;
    }
  }

  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data } = await api.post('/auth/otp/send', { phone });
      return data;
    } catch (error) {
      console.error('OTP send error:', error);
      throw error;
    }
  }

  async verifyOTP(verification: OTPVerification): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>('/auth/otp/verify', verification);
      this.setToken(data.token);
      this.setUser(data.user);
      return data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data } = await api.post('/auth/password/reset', { email });
      return data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean }> {
    try {
      const { data } = await api.post('/auth/password/change', { oldPassword, newPassword });
      return data;
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
      this.clearAuth();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const { data } = await api.post<{ token: string }>('/auth/token/refresh');
      this.setToken(data.token);
      return data.token;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: AuthResponse['user']): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): AuthResponse['user'] | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  private clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
export default authService;
