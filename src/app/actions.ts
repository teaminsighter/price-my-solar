
'use server';

import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc, deleteDoc, where, query, getDoc, setDoc, writeBatch } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import type { QuoteData } from '@/components/quote-funnel';
import type { Webhook } from '@/app/admin/webhooks/page';

export async function saveQuoteToFirestore(quoteData: QuoteData) {
  try {
    const sanitizedQuoteData: { [key: string]: any } = {};
    for (const key in quoteData) {
      const typedKey = key as keyof QuoteData;
      // Ensure urlParams is handled correctly as an object
      if (typedKey === 'urlParams' && typeof quoteData.urlParams === 'object' && quoteData.urlParams !== null) {
        sanitizedQuoteData[typedKey] = quoteData.urlParams;
      } else if (quoteData[typedKey] !== undefined) {
        sanitizedQuoteData[typedKey] = quoteData[typedKey];
      }
    }

    const docRef = await addDoc(collection(db, 'quotes'), {
      ...sanitizedQuoteData,
      createdAt: serverTimestamp(),
      deleted: false, // Add deleted flag
    });

    console.log('Document written with ID: ', docRef.id);
    
    // After saving, trigger active webhooks without awaiting the result
    triggerActiveWebhooks(sanitizedQuoteData as QuoteData);

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

export async function getLeads(includeDeleted = false) {
    try {
        const q = query(collection(db, "quotes"), where("deleted", "==", includeDeleted));
        const querySnapshot = await getDocs(q);
        const leads = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null;
            return {
                id: doc.id,
                ...data,
                createdAt: createdAt,
            };
        });
        return { success: true, leads };
    } catch (error) {
        console.error("Error fetching leads: ", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch leads.';
        return { success: false, error: errorMessage };
    }
}

export async function moveToTrash(id: string) {
    try {
        const leadRef = doc(db, "quotes", id);
        await updateDoc(leadRef, { deleted: true });
        return { success: true };
    } catch (error) {
        console.error("Error moving lead to trash: ", error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}

export async function restoreFromTrash(id: string) {
    try {
        const leadRef = doc(db, "quotes", id);
        await updateDoc(leadRef, { deleted: false });
        return { success: true };
    } catch (error) {
        console.error("Error restoring lead from trash: ", error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}

export async function deleteLeadPermanently(id: string) {
    try {
        await deleteDoc(doc(db, "quotes", id));
        return { success: true };
    } catch (error) {
        console.error("Error permanently deleting lead: ", error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}

export async function emptyTrash() {
    try {
        const q = query(collection(db, "quotes"), where("deleted", "==", true));
        const querySnapshot = await getDocs(q);
        const batch = writeBatch(db);
        querySnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        return { success: true, deletedCount: querySnapshot.size };
    } catch (error) {
        console.error("Error emptying trash: ", error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}


// Webhook Actions

export async function getWebhooks() {
    try {
        const querySnapshot = await getDocs(collection(db, "webhooks"));
        const webhooks = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null;
            return {
                id: doc.id,
                name: data.name,
                url: data.url,
                active: data.active,
                createdAt,
            };
        });
        return { success: true, webhooks: webhooks as Webhook[] };
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

// Site Settings Actions
export async function getSetting(key: string): Promise<{ success: boolean; value?: string; error?: string }> {
  try {
    const docRef = doc(db, 'settings', key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, value: docSnap.data().url };
    }
    return { success: true, value: '' };
  } catch (error) {
    console.error(`Error fetching setting ${key}: `, error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}

export async function saveSetting(key: string, url: string): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, 'settings', key);
    await setDoc(docRef, { url });
    return { success: true };
  } catch (error) {
    console.error(`Error saving setting ${key}: `, error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}

export async function uploadFileAndSaveSetting(
    key: string,
    fileData: { base64: string, type: string, name: string }
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!fileData) {
    return { success: false, error: 'No file provided.' };
  }

  try {
    const storageRef = ref(storage, `site-settings/${key}-${Date.now()}-${fileData.name}`);

    const snapshot = await uploadString(storageRef, fileData.base64, 'data_url');
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    await saveSetting(key, downloadURL);

    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('Error uploading file: ', error);
    if (error instanceof Error && 'code' in error) {
        if ((error as any).code === 'storage/unauthorized') {
             return { success: false, error: 'Firebase Storage: You do not have permission to upload files. Please check your Storage Security Rules.' };
        }
    }
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}
