import React, { useState } from 'react';

type CommentFormProps = {
  onSubmit: (formData: { comment: string }) => void;
  className?: string;
};

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ comment });
    setComment(''); 
  };
  return (
    <form onSubmit={handleSubmit} >
      <div className="mx-auto max-w-screen-sm px-4 pl-0 pr-0	">
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
                className={`relative inline-flex h-10 w-auto max-w-full cursor-pointer items-center justify-center overflow-hidden whitespace-pre rounded-md bg-transparent px-4 text-center text-sm font-medium normal-case text-white opacity-100 outline-none`}
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

export default CommentForm;
