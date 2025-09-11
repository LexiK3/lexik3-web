// services/interfaces/IAuthService.ts
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User, 
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../../types/auth';

/**
 * Authentication service interface following Clean Architecture principles
 * Defines the contract for authentication operations
 */
export interface IAuthService {
  /**
   * Register a new user account
   * @param userData - User registration data
   * @returns Promise<User> - The created user
   */
  register(userData: RegisterRequest): Promise<User>;

  /**
   * Authenticate user with credentials
   * @param credentials - User login credentials
   * @returns Promise<AuthResponse> - Authentication response with tokens
   */
  login(credentials: LoginRequest): Promise<AuthResponse>;

  /**
   * Refresh expired access token
   * @returns Promise<AuthResponse> - New authentication response
   */
  refreshToken(): Promise<AuthResponse>;

  /**
   * Logout current user
   * @returns Promise<void>
   */
  logout(): Promise<void>;

  /**
   * Get current authenticated user
   * @returns User | null - Current user or null if not authenticated
   */
  getCurrentUser(): User | null;

  /**
   * Check if user is currently authenticated
   * @returns boolean - True if authenticated
   */
  isAuthenticated(): boolean;

  /**
   * Change user password
   * @param passwordData - Password change data
   * @returns Promise<void>
   */
  changePassword(passwordData: ChangePasswordRequest): Promise<void>;

  /**
   * Request password reset
   * @param email - User email for password reset
   * @returns Promise<void>
   */
  forgotPassword(email: ForgotPasswordRequest): Promise<void>;

  /**
   * Reset password with token
   * @param resetData - Password reset data
   * @returns Promise<void>
   */
  resetPassword(resetData: ResetPasswordRequest): Promise<void>;
}
