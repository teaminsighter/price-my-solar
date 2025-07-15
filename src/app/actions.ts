
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { QuoteData } from '@/components/quote-funnel';

export async function saveQuoteToFirestore(quoteData: QuoteData) {
  try {
    const docRef = await addDoc(collection(db, 'quotes'), {
      ...quoteData,
      createdAt: serverTimestamp(),
    });
    console.log('Document written with ID: ', docRef.id);
    return { success: true, docId: docRef.id };
  } catch (e) {
    console.error('Error adding document: ', e);
    return { success: false, error: 'Failed to save quote.' };
  }
}
