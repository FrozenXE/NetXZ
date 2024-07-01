import React, { useState } from 'react';

type CommentFormMobileProps = {
  onSubmit: (formData: { comment: string }) => void;
  commentId?: string;
  onCancel: () => void;
  className?: string;
};

const CommentFormMobile: React.FC<CommentFormMobileProps> = ({ onSubmit, onCancel, className }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ comment });
    setComment(''); // Clear the textarea after submission
    onCancel(); // Close the form after submitting
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="mx-auto w-11/12 max-w-screen-sm fixed bottom-20 !bg-zinc-800">
        <div className="flex text-left text-gray-700">
          <div className="w-full space-y-3 text-gray-700">
            <div className="flex w-full flex-row justify-between">
              <textarea
                name="comment"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ resize: 'none' }}
                className="h-10 !bg-zinc-800 text-left w-10/12 min-w-3/4 max-w-3/4 overflow-hidden whitespace-pre-wrap rounded-md border border-none bg-transparent p-5 text-sm font-normal normal-case text-white opacity-100 outline-none"
              ></textarea>
              <button
                type="submit"
                className="inline-flex h-10 w-auto max-w-full cursor-pointer items-center justify-center overflow-hidden whitespace-pre rounded-md bg-transparent px-4 text-center text-sm font-medium normal-case text-white opacity-100 outline-none left-10 pt-3"
              >
                Post
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex h-10 w-auto max-w-full cursor-pointer items-center justify-center overflow-hidden whitespace-pre rounded-md bg-transparent px-4 text-center text-sm font-medium normal-case text-white opacity-100 outline-none left-10 pt-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentFormMobile;
