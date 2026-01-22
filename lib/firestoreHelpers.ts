import {
  db,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
  setDoc,
  updateDoc,
  increment,
} from './firebaseClient';

/**
 * DOCUMENTS COLLECTION
 */
export interface DocumentData {
  id: string;
  title: string;
  description: string;
  file_type: string;
  category_id: number;
  created_at: Timestamp;
  status: 'pending' | 'approved' | 'rejected';
  user_id: string;
  user_email: string;
  file_url?: string;
  university?: string;
  likes_count?: number;
  favorites_count?: number;
  comments_count?: number;
  subject?: string;
  tags?: string[];
  difficulty?: string;
  study_level?: string;
  is_public?: boolean;
  other_category_name?: string;
}

// Fetch all approved documents
export const getApprovedDocuments = async (): Promise<DocumentData[]> => {
  try {
    const q = query(collection(db, 'documents'), where('status', '==', 'approved'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      created_at: doc.data().created_at,
      likes_count: Math.max(0, doc.data().likes_count ?? 0),
      favorites_count: Math.max(0, doc.data().favorites_count ?? 0),
      comments_count: Math.max(0, doc.data().comments_count ?? 0),
    } as DocumentData));
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};

// Fetch documents by status (admin use)
export const getDocumentsByStatus = async (status: 'pending' | 'approved' | 'rejected'): Promise<DocumentData[]> => {
  try {
    const q = query(collection(db, 'documents'), where('status', '==', status));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      created_at: doc.data().created_at,
      likes_count: Math.max(0, doc.data().likes_count ?? 0),
      favorites_count: Math.max(0, doc.data().favorites_count ?? 0),
      comments_count: Math.max(0, doc.data().comments_count ?? 0),
    } as DocumentData));
  } catch (error) {
    console.error('Error fetching documents by status:', error);
    return [];
  }
};

// Fetch document by ID
export const getDocumentById = async (docId: string): Promise<DocumentData | null> => {
  try {
    const docRef = doc(db, 'documents', docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as DocumentData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching document:', error);
    return null;
  }
};

// Create new document
export const createDocument = async (data: Omit<DocumentData, 'id' | 'created_at'>) => {
  try {
    const docRef = await addDoc(collection(db, 'documents'), {
      ...data,
      created_at: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

// Admin: update document status
export const updateDocumentStatus = async (docId: string, status: 'approved' | 'rejected') => {
  try {
    const docRef = doc(db, 'documents', docId);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error('Error updating document status:', error);
    throw error;
  }
};

// Admin: delete document
export const deleteDocumentById = async (docId: string) => {
  try {
    const docRef = doc(db, 'documents', docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

/**
 * LIKES COLLECTION
 */
export interface LikeData {
  document_id: string;
  user_id: string;
  created_at: Timestamp;
}

// Check if user liked document
export const checkIfLiked = async (userId: string, docId: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'likes'),
      where('user_id', '==', userId),
      where('document_id', '==', docId)
    );
    const snapshot = await getDocs(q);
    return snapshot.size > 0;
  } catch (error) {
    console.error('Error checking like:', error);
    return false;
  }
};

// Get user's liked document IDs
export const getUserLikes = async (userId: string): Promise<string[]> => {
  try {
    const q = query(collection(db, 'likes'), where('user_id', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data().document_id);
  } catch (error) {
    console.error('Error fetching likes:', error);
    return [];
  }
};

// Add like
export const addLike = async (userId: string, docId: string) => {
  try {
    // Add like record
    await addDoc(collection(db, 'likes'), {
      user_id: userId,
      document_id: docId,
      created_at: Timestamp.now(),
    });
    
    // Increment likes_count in document
    const docRef = doc(db, 'documents', docId);
    await updateDoc(docRef, {
      likes_count: increment(1),
    });
  } catch (error) {
    console.error('Error adding like:', error);
    throw error;
  }
};

// Remove like
export const removeLike = async (userId: string, docId: string) => {
  try {
    const q = query(
      collection(db, 'likes'),
      where('user_id', '==', userId),
      where('document_id', '==', docId)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => deleteDoc(doc.ref));
    
    // Decrement likes_count in document (prevent negative)
    const docRef = doc(db, 'documents', docId);
    const docSnap = await getDoc(docRef);
    const currentCount = docSnap.exists() ? (docSnap.data().likes_count ?? 0) : 0;
    
    if (currentCount > 0) {
      await updateDoc(docRef, {
        likes_count: increment(-1),
      });
    }
  } catch (error) {
    console.error('Error removing like:', error);
    throw error;
  }
};

/**
 * FAVORITES COLLECTION
 */
export interface FavoriteData {
  document_id: string;
  user_id: string;
  created_at: Timestamp;
}

// Check if user favorited document
export const checkIfFavorited = async (userId: string, docId: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'favorites'),
      where('user_id', '==', userId),
      where('document_id', '==', docId)
    );
    const snapshot = await getDocs(q);
    return snapshot.size > 0;
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

// Get user's favorited document IDs
export const getUserFavorites = async (userId: string): Promise<string[]> => {
  try {
    const q = query(collection(db, 'favorites'), where('user_id', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data().document_id);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

// Add favorite
export const addFavorite = async (userId: string, docId: string) => {
  try {
    await addDoc(collection(db, 'favorites'), {
      user_id: userId,
      document_id: docId,
      created_at: Timestamp.now(),
    });
    // Increment favorites_count in document
    const docRef = doc(db, 'documents', docId);
    await updateDoc(docRef, {
      favorites_count: increment(1),
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

// Remove favorite
export const removeFavorite = async (userId: string, docId: string) => {
  try {
    const q = query(
      collection(db, 'favorites'),
      where('user_id', '==', userId),
      where('document_id', '==', docId)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => deleteDoc(doc.ref));
    
    // Decrement favorites_count in document (prevent negative)
    const docRef = doc(db, 'documents', docId);
    const docSnap = await getDoc(docRef);
    const currentCount = docSnap.exists() ? (docSnap.data().favorites_count ?? 0) : 0;
    
    if (currentCount > 0) {
      await updateDoc(docRef, {
        favorites_count: increment(-1),
      });
    }
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

/**
 * COMMENTS COLLECTION
 */
export interface CommentData {
  id: string;
  document_id: string;
  user_id: string;
  content: string;
  created_at: Timestamp;
  user_email?: string;
  user_name?: string;
}

// Get comments for document
export const getComments = async (docId: string): Promise<CommentData[]> => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('document_id', '==', docId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
        created_at: doc.data().created_at,
      } as CommentData))
      .sort((a, b) => b.created_at.toMillis() - a.created_at.toMillis());
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

// Add comment
export const addComment = async (
  docId: string,
  userId: string,
  content: string,
  userEmail?: string,
  userName?: string
) => {
  try {
    await addDoc(collection(db, 'comments'), {
      document_id: docId,
      user_id: userId,
      content: content,
      created_at: Timestamp.now(),
      user_email: userEmail,
      user_name: userName,
    });
    // Increment comments_count in document
    const docRef = doc(db, 'documents', docId);
    await updateDoc(docRef, {
      comments_count: increment(1),
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Delete comment
export const deleteComment = async (commentId: string) => {
  try {
    // Fetch comment to get document_id
    const commentRef = doc(db, 'comments', commentId);
    const commentSnap = await getDoc(commentRef);
    const documentId = commentSnap.exists() ? (commentSnap.data() as any).document_id : undefined;

    await deleteDoc(commentRef);

    if (documentId) {
      const docRef = doc(db, 'documents', documentId);
      const docSnap = await getDoc(docRef);
      const currentCount = docSnap.exists() ? (docSnap.data().comments_count ?? 0) : 0;
      
      if (currentCount > 0) {
        await updateDoc(docRef, {
          comments_count: increment(-1),
        });
      }
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

/**
 * CATEGORIES COLLECTION
 */
export interface CategoryData {
  id: string;
  name: string;
}

// Get all categories
export const getCategories = async (): Promise<CategoryData[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'categories'));
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as CategoryData));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Ensure a category exists (used when users submit documents)
export const ensureCategoryExists = async (name: string, userId: string = '') => {
  const trimmed = name.trim();
  if (!trimmed) return;

  try {
    const q = query(collection(db, 'categories'), where('name', '==', trimmed));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) return; // already exists

    await addDoc(collection(db, 'categories'), {
      name: trimmed,
      user_id: userId,
      created_at: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error ensuring category exists:', error);
  }
};

/**
 * UTILITY FUNCTIONS
 */

// Format timestamp to readable string
export const formatTime = (timestamp: Timestamp): string => {
  const date = timestamp.toDate();
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

// Get file icon by type
export const getFileIcon = (fileType: string): string => {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word') || fileType.includes('document')) return '📝';
  if (fileType.includes('presentation')) return '🎓';
  if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
  return '📎';
};

/**
 * USER PROFILE FUNCTIONS
 */

// Get user's uploaded documents (all statuses)
export const getUserDocuments = async (userId: string): Promise<DocumentData[]> => {
  try {
    const q = query(collection(db, 'documents'), where('user_id', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
        created_at: doc.data().created_at,
        likes_count: Math.max(0, doc.data().likes_count ?? 0),
        favorites_count: Math.max(0, doc.data().favorites_count ?? 0),
        comments_count: Math.max(0, doc.data().comments_count ?? 0),
      } as DocumentData))
      .sort((a, b) => b.created_at.toMillis() - a.created_at.toMillis());
  } catch (error) {
    console.error('Error fetching user documents:', error);
    return [];
  }
};

// Get user's favorited documents with full data
export const getUserFavoritedDocuments = async (userId: string): Promise<DocumentData[]> => {
  try {
    const favoriteIds = await getUserFavorites(userId);
    if (favoriteIds.length === 0) return [];
    
    const documents: DocumentData[] = [];
    for (const docId of favoriteIds) {
      const docData = await getDocumentById(docId);
      if (docData && docData.status === 'approved') {
        documents.push(docData);
      }
    }
    return documents.sort((a, b) => b.created_at.toMillis() - a.created_at.toMillis());
  } catch (error) {
    console.error('Error fetching favorited documents:', error);
    return [];
  }
};

// Get user statistics
export const getUserStats = async (userId: string) => {
  try {
    const [uploads, likes, comments, favorites] = await Promise.all([
      getUserDocuments(userId).then(docs => docs.length),
      getUserLikes(userId).then(likes => likes.length),
      getDocs(query(collection(db, 'comments'), where('user_id', '==', userId))).then(snap => snap.size),
      getUserFavorites(userId).then(favs => favs.length),
    ]);
    
    return { uploads, likes, comments, favorites };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { uploads: 0, likes: 0, comments: 0, favorites: 0 };
  }
};
