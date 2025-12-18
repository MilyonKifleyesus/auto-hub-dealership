import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthChangeEvent, Session, Subscription } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'customer' | 'admin' | 'staff';
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        console.log('Checking initial authentication state...');
        
        if (!supabase) {
          console.log('Supabase not configured, using mock auth');
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          console.log('Found existing session for:', session.user.email);
          await fetchUserProfile(session.user.id);
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Initial session error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    let subscription: Subscription | null = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state changed:', event);
        
        if (mounted) {
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      if (!supabase) return;

      console.log('Fetching user profile for:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        return;
      }

      if (data) {
        const userProfile: User = {
          id: data.id,
          email: data.email,
          full_name: data.full_name,
          phone: data.phone,
          role: data.role,
          avatar_url: data.avatar_url
        };
        
        setUser(userProfile);
        console.log('User profile loaded:', data.email, 'Role:', data.role);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };

  const checkIsAdmin = async (userId: string): Promise<{ isAdmin: boolean; error?: string }> => {
    if (!supabase) {
      return { isAdmin: false, error: 'Authentication service not configured.' };
    }

    try {
      const { data: rpcResult, error: rpcError } = await supabase.rpc('is_admin', { user_uuid: userId });
      if (!rpcError && typeof rpcResult === 'boolean') {
        return { isAdmin: rpcResult };
      }
      if (rpcError) {
        console.warn('RPC is_admin failed, falling back to profile role lookup:', rpcError);
      }
    } catch (error) {
      console.warn('is_admin RPC exception, falling back to profile role lookup:', error);
    }

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError) {
        return { isAdmin: false, error: profileError.message };
      }

      return { isAdmin: profile?.role === 'admin' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Admin check failed';
      return { isAdmin: false, error: message };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      if (!supabase) {
        setLoading(false);
        console.error('Supabase client not available. Cannot sign in.');
        return { success: false, error: 'Authentication service not configured.' };
      }

      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('Sign in successful, verifying admin status for:', data.user.id);

        const { isAdmin, error: adminError } = await checkIsAdmin(data.user.id);

        if (isAdmin) {
          console.log('Admin status confirmed for:', email);
          await fetchUserProfile(data.user.id);
          setLoading(false);
          return { success: true };
        } else {
          console.warn('Access Denied: User is not an admin:', email, adminError ? `(${adminError})` : '');
          await supabase.auth.signOut();
          setLoading(false);
          return { success: false, error: adminError || 'Access denied. User is not an admin.' };
        }
      }

      setLoading(false);
      return { success: false, error: 'Unknown error occurred' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      console.error('Sign in exception:', error);
      setLoading(false);
      return { success: false, error: message };
    }
  };

  const signUp = async (email: string, password: string, userData?: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      if (!supabase) {
        setLoading(false);
        return { success: false, error: 'Authentication not configured' };
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name,
            phone: userData?.phone,
            role: userData?.role || 'customer'
          }
        }
      });

      setLoading(false);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      setLoading(false);
      return { success: false, error: message };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      
      if (supabase) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setLoading(false);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!supabase || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      setUser(prev => prev ? { ...prev, ...updates } : null);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed';
      return { success: false, error: message };
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin,
      signIn,
      signUp,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
