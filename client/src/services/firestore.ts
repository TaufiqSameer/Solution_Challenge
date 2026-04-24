import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
  } from "firebase/firestore"
  import { db } from "../firebase"
  import type { Zone } from "../types"
  
  export interface AllocationSession {
    id?: string
    fileName: string
    zones: Zone[]
    prescription: string
    createdAt?: any
  }
  
  export interface AuditEntry {
    id?: string
    sessionId: string
    action: string
    zone: string
    createdAt?: any
  }
  
  export async function saveSession(
    fileName: string,
    zones: Zone[],
    prescription: string
  ): Promise<string> {
    const docRef = await addDoc(collection(db, "sessions"), {
      fileName,
      zones,
      prescription,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  }
  
  export async function getSessions(): Promise<AllocationSession[]> {
    const q = query(collection(db, "sessions"), orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }))
  }
  
  export async function logAction(
    sessionId: string,
    action: string,
    zone: string
  ): Promise<void> {
    await addDoc(collection(db, "auditLog"), {
      sessionId,
      action,
      zone,
      createdAt: serverTimestamp(),
    })
  }
  
  export async function getAuditLog(): Promise<AuditEntry[]> {
    const q = query(collection(db, "auditLog"), orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }))
  }