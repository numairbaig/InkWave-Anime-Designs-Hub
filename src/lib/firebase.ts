import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, Creator, UserProfile, PlatformConfig, AffiliateApplication } from '../types';


// Use environment variables if set (e.g., when deploying to Vercel), falling back to local config JSON.
const firebaseApiKey = (import.meta.env?.VITE_FIREBASE_API_KEY as string) || firebaseConfig.apiKey;
const firebaseAuthDomain = (import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN as string) || firebaseConfig.authDomain;
const firebaseProjectId = (import.meta.env?.VITE_FIREBASE_PROJECT_ID as string) || firebaseConfig.projectId;
const firebaseStorageBucket = (import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET as string) || firebaseConfig.storageBucket;
const firebaseMessagingSenderId = (import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || firebaseConfig.messagingSenderId;
const firebaseAppId = (import.meta.env?.VITE_FIREBASE_APP_ID as string) || firebaseConfig.appId;
const firebaseDatabaseId = (import.meta.env?.VITE_FIREBASE_DATABASE_ID as string) || firebaseConfig.firestoreDatabaseId || '(default)';
const firebaseDatabaseURL = (import.meta.env?.VITE_FIREBASE_DATABASE_URL as string) || (firebaseConfig as any).databaseURL;

const app = initializeApp({
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
  databaseURL: firebaseDatabaseURL
});

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, firebaseDatabaseId);
export const auth = getAuth(app);


// 1. Get Products
export async function getProductsFromDb(): Promise<Product[]> {
  try {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    const productsList: Product[] = [];
    snapshot.forEach((docSnap) => {
      productsList.push(docSnap.data() as Product);
    });
    return productsList;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'products');
  }
}

// 2. Get Creators
export async function getCreatorsFromDb(): Promise<Creator[]> {
  try {
    const creatorsCol = collection(db, 'creators');
    const snapshot = await getDocs(creatorsCol);
    const creatorsList: Creator[] = [];
    snapshot.forEach((docSnap) => {
      creatorsList.push(docSnap.data() as Creator);
    });
    return creatorsList;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'creators');
  }
}

// 3. Save / Update a product
export async function saveProductToDb(product: Product): Promise<void> {
  const path = `products/${product.id}`;
  try {
    await setDoc(doc(db, 'products', product.id), product);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 4. Save / Update a creator
export async function saveCreatorToDb(creator: Creator): Promise<void> {
  const path = `creators/${creator.id}`;
  try {
    await setDoc(doc(db, 'creators', creator.id), creator);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 5. Delete a product
export async function deleteProductFromDb(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 5b. Platform Configuration Settings
export async function getPlatformConfigFromDb(): Promise<PlatformConfig> {
  const defaultConfig: PlatformConfig = {
    maintenanceMode: false,
    disableRegistrations: false,
    commissionFee: 15,
    featuredBannerText: "Premium Anime T-Shirt Designs Built To Sell",
    announcementSub: "Download professionally crafted anime-inspired artwork ready for custom apparel brands, Etsy, and print-on-demand stores.",
    allowInstantFreeDownloads: false
  };

  const path = 'settings/platform_config';
  try {
    const configDocRef = doc(db, 'settings', 'platform_config');
    const docSnap = await getDoc(configDocRef);
    if (docSnap.exists()) {
      return { ...defaultConfig, ...docSnap.data() } as PlatformConfig;
    } else {
      // Auto-seed default configuration
      await setDoc(configDocRef, defaultConfig);
      return defaultConfig;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function savePlatformConfigToDb(config: PlatformConfig): Promise<void> {
  const path = 'settings/platform_config';
  try {
    const configDocRef = doc(db, 'settings', 'platform_config');
    await setDoc(configDocRef, config);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}


// 6. Auth helpers
const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// 7. Profile helpers and Error Handlers
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      try {
        localStorage.setItem(`inkwave_profile_${uid}`, JSON.stringify(data));
      } catch (_) {}
      return data;
    }
    return null;
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes('offline')) {
      console.warn('Firestore is offline, returning cached or local fallback profile.');
      const localProfileStr = localStorage.getItem(`inkwave_profile_${uid}`);
      if (localProfileStr) {
        try {
          return JSON.parse(localProfileStr);
        } catch (_) {}
      }
      if (auth.currentUser && auth.currentUser.uid === uid) {
        return {
          uid,
          email: auth.currentUser.email || '',
          displayName: auth.currentUser.displayName || 'User',
          role: 'buyer',
          createdAt: new Date().toISOString()
        };
      }
    }
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const path = `users/${profile.uid}`;
  try {
    await setDoc(doc(db, 'users', profile.uid), profile);
    try {
      localStorage.setItem(`inkwave_profile_${profile.uid}`, JSON.stringify(profile));
    } catch (_) {}
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveAffiliateApplication(application: AffiliateApplication): Promise<void> {
  const path = `affiliate_applications/${application.id}`;
  try {
    await setDoc(doc(db, 'affiliate_applications', application.id), application);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}



