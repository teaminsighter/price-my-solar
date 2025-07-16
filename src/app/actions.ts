
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import type { QuoteData } from '@/components/quote-funnel';

export async function saveQuoteToFirestore(quoteData: QuoteData) {
  try {
    // Create a new object and copy only the defined properties
    const sanitizedQuoteData: { [key: string]: any } = {};
    for (const key in quoteData) {
      if (quoteData[key as keyof QuoteData] !== undefined) {
        sanitizedQuoteData[key] = quoteData[key as keyof QuoteData];
      }
    }

    const docRef = await addDoc(collection(db, 'quotes'), {
      ...sanitizedQuoteData,
      createdAt: serverTimestamp(),
    });
    console.log('Document written with ID: ', docRef.id);
    return { success: true, docId: docRef.id };
  } catch (e) {
    console.error('Error adding document: ', e);
    const errorMessage = e instanceof Error ? e.message : 'Failed to save quote.';
    return { success: false, error: errorMessage };
  }
}


export async function getLeads() {
    try {
        const querySnapshot = await getDocs(collection(db, "quotes"));
        const leads = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Convert Firestore Timestamp to a serializable format (ISO string)
                createdAt: data.createdAt?.toDate()?.toISOString() || null,
            };
        });
        return { success: true, leads };
    } catch (error) {
        console.error("Error fetching leads: ", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch leads.';
        return { success: false, error: errorMessage };
    }
}
