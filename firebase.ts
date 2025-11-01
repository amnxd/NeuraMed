import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Load config from firebase.config.js at project root. Supports default or named export firebaseConfig.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as firebaseConfigFile from "./firebase.config";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const firebaseConfig: any = (firebaseConfigFile as any).default ?? (firebaseConfigFile as any).firebaseConfig ?? firebaseConfigFile;

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
