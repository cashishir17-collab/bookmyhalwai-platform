import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AddNotificationInput {
  userId: string;
  bookingId?: string;
  type: string;
  title: string;
  message: string;
}

export async function addNotification({ userId, bookingId, type, title, message }: AddNotificationInput) {
  if (!db) {
    return null;
  }

  return addDoc(collection(db, "notifications"), {
    userId,
    bookingId: bookingId || null,
    type,
    title,
    message,
    read: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
