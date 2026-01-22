'use client';

import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { useTheme } from 'next-themes';
import { auth, onAuthStateChanged } from '@/lib/firebaseClient';
import type { User } from 'firebase/auth';
import { getComments, addComment, formatTime, CommentData } from '@/lib/firestoreHelpers';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
  authorName: string;
  userId: string | null;
  onCommentAdded?: () => void;
}

export default function CommentModal({
  isOpen,
  onClose,
  documentId,
  documentTitle,
  authorName,
  userId,
  onCommentAdded,
}: CommentModalProps) {
  const { theme } = useTheme();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  // Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen, documentId]);

  const loadComments = async () => {
    setFetching(true);
    try {
      const data = await getComments(documentId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !currentUser?.uid) return;

    setLoading(true);
    try {
      await addComment(
        documentId,
        currentUser.uid,
        comment.trim(),
        currentUser.email || undefined,
        currentUser.displayName || undefined
      );

      setComment('');
      await loadComments();
      // Trigger callback to update parent component
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        } rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl`}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center p-6 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <h2 className="text-xl font-bold">Comment on {documentTitle}</h2>
          <button
            onClick={onClose}
            className={`p-1 hover:bg-gray-200 rounded ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-300'
                : 'text-gray-600'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
          {/* Input Section */}
          {currentUser ? (
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {currentUser.displayName?.[0].toUpperCase() ||
                    currentUser.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-2">
                    {currentUser.displayName || currentUser.email}
                  </p>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-gray-50 border-gray-300 text-black'
                    }`}
                    rows={3}
                  />
                  <button
                    type="submit"
                    disabled={loading || !comment.trim()}
                    className={`mt-3 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${
                      comment.trim() && !loading
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Send size={16} />
                    {loading ? 'Posting...' : 'Comment'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div
              className={`text-center py-6 mb-6 rounded ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-300'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Please sign in to comment
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {fetching ? (
              <div
                className={`text-center py-6 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                Loading comments...
              </div>
            ) : comments.length === 0 ? (
              <div
                className={`text-center py-6 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {c.user_name?.[0].toUpperCase() ||
                      c.user_email?.[0].toUpperCase() ||
                      'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">
                        {c.user_name || c.user_email}
                      </p>
                      <span
                        className={`text-xs ${
                          theme === 'dark'
                            ? 'text-gray-500'
                            : 'text-gray-400'
                        }`}
                      >
                        {formatTime(c.created_at)}
                      </span>
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        theme === 'dark'
                          ? 'text-gray-300'
                          : 'text-gray-700'
                      }`}
                    >
                      {c.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`flex justify-end gap-3 p-6 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              theme === 'dark'
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

