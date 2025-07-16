
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc, deleteDoc, where, query, getDoc, setDoc } from 'firebase/firestore';
import type { QuoteData } from '@/components/quote-funnel';
import type { Webhook } from '@/app/admin/webhooks/page';

export async function saveQuoteToFirestore(quoteData: QuoteData) {
  try {
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
    
    // After saving, trigger active webhooks without awaiting the result
    triggerActiveWebhooks(sanitizedQuoteData);

    return { success: true, docId: docRef.id };
  } catch (e) {
    console.error('Error adding document: ', e);
    const errorMessage = e instanceof Error ? e.message : 'Failed to save quote.';
    return { success: false, error: errorMessage };
  }
}

async function triggerActiveWebhooks(quoteData: QuoteData) {
    try {
        const q = query(collection(db, "webhooks"), where("active", "==", true));
        const querySnapshot = await getDocs(q);
        const webhooks = querySnapshot.docs.map(doc => doc.data() as Webhook);

        if (webhooks.length > 0) {
            console.log(`Triggering ${webhooks.length} active webhook(s)...`);
        }

        const webhookPromises = webhooks.map(webhook => {
            console.log(`Sending POST to: ${webhook.url}`);
            return fetch(webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quoteData),
            }).catch(error => {
                console.error(`Error triggering webhook ${webhook.name} at ${webhook.url}:`, error);
            });
        });
        
        // We don't await these promises so the user response isn't blocked.
        Promise.all(webhookPromises);

    } catch (error) {
        console.error("Error fetching or triggering webhooks:", error);
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

// Webhook Actions

export async function getWebhooks() {
    try {
        const querySnapshot = await getDocs(collection(db, "webhooks"));
        const webhooks = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as Webhook));
        return { success: true, webhooks };
    } catch (error) {
        console.error("Error fetching webhooks: ", error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}

export async function addWebhook(name: string, url: string) {
    try {
        await addDoc(collection(db, "webhooks"), {
            name,
            url,
            active: true,
            createdAt: serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error("Error adding webhook: ", error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}

export async function updateWebhookStatus(id: string, active: boolean) {
    try {
        const webhookRef = doc(db, "webhooks", id);
        await updateDoc(webhookRef, { active });
        return { success: true };
    } catch (error) {
        console.error("Error updating webhook status: ", error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}

export async function deleteWebhook(id: string) {
    try {
        await deleteDoc(doc(db, "webhooks", id));
        return { success: true };
    } catch (error) {
        console.error("Error deleting webhook: ", error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}

// GTM Actions
export async function getGtmSnippet(): Promise<{ success: boolean, snippet?: string, error?: string }> {
    try {
        const docRef = doc(db, "settings", "gtm");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, snippet: docSnap.data().headSnippet };
        }
        return { success: true, snippet: "" };
    } catch (error) {
        console.error("Error fetching GTM snippet: ", error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}

export async function saveGtmSnippet(snippet: string): Promise<{ success: boolean, error?: string }> {
    try {
        const docRef = doc(db, "settings", "gtm");
        await setDoc(docRef, { headSnippet: snippet });
        return { success: true };
    } catch (error) {
        console.error("Error saving GTM snippet: ", error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}
