import React from "react";
import { CommentData } from "@/lib/appwrite/api";
import { Loader } from "@/components/shared";
import CommentRender from "./CommentRender";
import CommentFormMobile from "../forms/CommentFormMobile";


type PopupCommentProps = {
    onClose: () => void;
    comments: CommentData[];
    editingCommentId: string | null;
    handleEditComment: (commentId: string, updatedCommentText: string) => Promise<void>;
    handleCancelEdit: () => void;
    user: any;
    handleEditButtonClick: (commentId: string) => void;
    handleDeleteComment: (commentId: string) => void;
    loading: boolean;
    postId: string;
    handleCommentFormSubmit: (formData: { comment: string }) => Promise<void>;
    commentFormClassName?: string; 
  };
  
  const PopupComment: React.FC<PopupCommentProps> = ({
    onClose,
    comments,
    editingCommentId,
    handleEditComment,
    handleCancelEdit,
    user,
    handleEditButtonClick,
    handleDeleteComment,
    loading,
    postId,
    handleCommentFormSubmit,
    commentFormClassName
  }) => {
    return (
      <div id="static-modal" data-modal-backdrop="static" tabIndex={-1} aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-screen">
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-zinc-800 rounded-lg shadow h-screen">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-white dark:text-white">Comments</h3>
              <button
                type="button"
                className="text-white bg-transparent hover:bg-gray-200 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={onClose}
              >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5 space-y-4 ">
              {loading ? (
                  <Loader />
                  ) : (
                <ul>
                  {comments
                    .filter((comment) => comment.postId === postId)
                    .map((comment) => (
                        <CommentRender
                        key={comment.commentId}
                        comment={comment}
                        editingCommentId={editingCommentId}
                        handleEditComment={handleEditComment}
                        handleCancelEdit={handleCancelEdit}
                        user={user}
                        handleEditButtonClick={handleEditButtonClick}
                        handleDeleteComment={handleDeleteComment}
                        />
                        ))}
                </ul>
              )}
            </div>
            <CommentFormMobile
              onSubmit={handleCommentFormSubmit}
              className={commentFormClassName}
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default PopupComment;