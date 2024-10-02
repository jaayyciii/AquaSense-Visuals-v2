import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "./FirebaseConfig";
import { ref, update } from "firebase/database";

// typescript data types
export type UserCredentialsType = {
  email: string;
  password: string;
};

// auth context typescript data types
const AuthContext = createContext<
  | {
      currentUser: User | null;
      register: (
        username: string,
        email: string,
        password: string
      ) => Promise<UserCredential>;
      login: (email: string, password: string) => Promise<UserCredential>;
      logout: () => Promise<void>;
      requestPasswordReset: (email: string) => Promise<void>;
    }
  | undefined
>(undefined);

// a custom hook that provides access to the authentication context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: React.PropsWithChildren<{}>) {
  // use state that holds current user credentials
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // loading value to avoid renders when performing
  const [loading, isLoading] = useState<boolean>(true);

  // user registration function, updates user display name, sends email verification
  function register(username: string, email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        if (userCredential.user) {
          return updateProfile(userCredential.user, {
            displayName: username,
          })
            .then(() => {
              try {
                update(ref(db, `Users`), {
                  [userCredential.user.uid]: "Guest",
                });
              } catch (error) {
                console.error(error);
              }
            })
            .then(() => {
              return sendEmailVerification(userCredential.user).then(
                () => userCredential
              );
            });
        }
        return userCredential;
      }
    );
  }

  // user login function
  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // user logout function
  function logout() {
    return signOut(auth);
  }

  // request password reset function
  function requestPasswordReset(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  // updates the currentUser state when the authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      isLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    register,
    login,
    logout,
    requestPasswordReset,
  };

  // auth context wrapper
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
