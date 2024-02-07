import React, { useState } from 'react';

type CommentFormMobileProps = {
  onSubmit: (formData: { comment: string }) => void;
  className?: string;
};

const CommentFormMobile: React.FC<CommentFormMobileProps> = ({ onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ comment });
    setComment(''); 
  };
  return (
    <form onSubmit={handleSubmit} >
      <div className="mx-auto max-w-screen-sm px-4 pl-0 pb-5 pr-0 fixed bottom-20">
        <div className="flex pt-10 text-left text-gray-700">
          <div className="w-full space-y-3 text-gray-700">
            <div className="flex flex-row justify-between">
              <textarea
                name="comment"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ resize: 'none' }}
                className=" h-10 text-left w-3/4 min-w-3/4 max-w-3/4 overflow-hidden whitespace-pre-wrap rounded-md border border-none bg-transparent p-5 text-sm font-normal normal-case text-white opacity-100 outline-none "
              ></textarea>
              <button
                type="submit"
                className={`relative inline-flex h-10 w-auto max-w-full cursor-pointer items-center justify-center overflow-hidden whitespace-pre rounded-md bg-transparent px-4 text-center text-sm font-medium normal-case text-white opacity-100 outline-none left-10 pt-3 `}
              >
                Post
              </button>

            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentFormMobile;
