import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toggleWatchlist as toggleWatchlistApi } from '../services/db';
import { isPremiumUser } from '../services/membership';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState('free');
  const [watchlist, setWatchlist] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const currentRole = data.role || 'user';
            const subscription = data.subscription || null;
            
            setRole(currentRole);
            setWatchlist(data.watchlist || []);
            
            const premium = isPremiumUser(currentRole, subscription);
            setIsPremium(premium);
            setMembershipStatus(premium ? 'premium' : 'free');
          } else {
            setRole('user');
            setWatchlist([]);
            setIsPremium(false);
            setMembershipStatus('free');
          }
        } catch (err) {
          console.error("Error fetching user data in AuthContext:", err);
          setRole('user');
          setWatchlist([]);
          setIsPremium(false);
          setMembershipStatus('free');
        }
      } else {
        setRole(null);
        setWatchlist([]);
        setIsPremium(false);
        setMembershipStatus('free');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const currentUser = userCredential.user;
    
    // Save additional profile data to Firestore
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        name: name,
        email: email,
        role: 'user',
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (dbErr) {
      console.warn("Failed to save user name to Firestore, but authentication succeeded:", dbErr);
    }
    return userCredential;
  };

  const logout = async () => {
    return signOut(auth);
  };

  const toggleWatchlist = async (subsidyId) => {
    if (!user) return false;
    const oldWatchlist = watchlist;
    const isAdded = watchlist.includes(subsidyId);
    const newList = isAdded 
      ? watchlist.filter(id => id !== subsidyId) 
      : [...watchlist, subsidyId];
    
    setWatchlist(newList);
    try {
      const success = await toggleWatchlistApi(user.uid, subsidyId);
      if (!success) {
        setWatchlist(oldWatchlist);
      }
      return success;
    } catch (e) {
      console.error("Failed to update watchlist in AuthContext", e);
      setWatchlist(oldWatchlist);
      return false;
    }
  };

  const upgradeToPremium = async () => {
    if (!user) return false;
    try {
      // Mock Stripe subscription details
      const subscriptionDetails = {
        id: 'sub_mock_' + Math.random().toString(36).substr(2, 9),
        status: 'active',
        planId: 'premium_standard',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), {
        subscription: subscriptionDetails
      }, { merge: true });

      setIsPremium(true);
      setMembershipStatus('premium');
      return true;
    } catch (error) {
      console.error("Failed to simulate upgrade to Premium:", error);
      return false;
    }
  };

  const value = {
    user,
    role,
    isPremium,
    membershipStatus,
    watchlist,
    authLoading,
    login,
    register,
    logout,
    toggleWatchlist,
    upgradeToPremium
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
