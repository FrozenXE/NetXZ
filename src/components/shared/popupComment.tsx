import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import EditComment from '@/_root/pages/EditComment';
import { multiFormatDateString } from "@/lib/utils";
import { CommentData, getCommentsData, createComment, deleteComment } from '@/lib/appwrite/api';
import CommentFormMobile from "../forms/CommentFormMobile";
import { Loader } from "@/components/shared";
import { disableBodyScroll, enableBodyScroll } from "@/lib/bodyscroll";
import { toast } from "react-toastify";

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
  comments: initialComments,
  editingCommentId,
  handleEditComment,
  handleCancelEdit,
  user,
  handleEditButtonClick,
  loading,
  postId,
  commentFormClassName
}) => {
  const [refreshing] = useState(false);
  const [comments, setComments] = useState<CommentData[]>(initialComments);

  const fetchComments = async (_useCache: boolean = true) => {
    try {
      const data = await getCommentsData(false);
      const filteredComments = data.filter(comment => comment.postId === postId);
      const sortedComments = filteredComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setComments(sortedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleNewComment = async (commentText: string) => {
    try {
      const newComment = await createComment(commentText, postId);
      setComments(prevComments => [newComment, ...prevComments]);
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error("Comment created unsuccessfully")
    }
  };

  const handleDeleteCommentInternal = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
      toast.success("Comment deleted successfully")
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Comment deleted unccessfully")
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleEditButtonClickInternal = (commentId: string) => {
    handleEditButtonClick(commentId);
  };
  useEffect(() => {
    disableBodyScroll();

    return () => {
      enableBodyScroll();
    };
  }, []);
  

  return (
    <div id="static-modal" data-modal-backdrop="static" tabIndex={-1} aria-hidden="true" className="bg-zinc-800 pb-10 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-screen">
      <div className="relative h-full w-full max-w-2xl max-h-full overflow-y-auto">
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
          <h2></h2>
          <div className="p-4 md:p-5 space-y-4">
              {loading || refreshing ? (
                <Loader />
              ) : (
                <ul>
                  {comments.map((comment) => (
                    <li key={comment.commentId} className="flex justify-center relative top-1/3 w-full border-white !mt-0">
                      {editingCommentId === comment.commentId ? (
                        <EditComment
                          initialCommentText={comment.commentText}
                          onSave={(updatedCommentText: string) => handleEditComment(comment.commentId, updatedCommentText)}
                          onCancel={handleCancelEdit}
                          userName={String(comment.userName)}
                          userImage={comment.userImage}
                          createdAt={multiFormatDateString(comment.createdAt)}
                        />
                      ) : (
                        <div className="relative grid grid-cols-1 gap-4 border border-none rounded-lg bg-transparent w-full pb-4">
                          <div className="relative flex gap-2">
                            <div className='w-1/6 m-auto'>
                              <img src={comment.userImage} className="w-post_details-card m-auto flex flex-col md:flex-row items-stretch md:items-start8 h-10 lg:w-12 lg:h-12 rounded-full" />
                            </div>
                            <div className="flex flex-col w-full h-full">
                              <div className="flex flex-row justify-between h-1/2">
                                <div className='flex-center gap-2'>
                                  <p className="relative text-l text-white whitespace-nowrap truncate overflow-hidden">{comment.userName}</p>
                                  <p className="text-white text-sm">{multiFormatDateString(comment.createdAt)} </p>
                                </div>
                                {user?.id === comment.userId && (
                                  <div className="flex flex-row gap-3">
                                    <Button
                                      onClick={() => handleEditButtonClickInternal(comment.commentId)}
                                      variant="ghost"
                                      className="post_details-edit_btn p-0 hover:bg-transparent"
                                    >
                                      <img src={"/assets/icons/edit.svg"} alt="edit" width={18} height={18} />
                                    </Button>
                                    <Button
                                      onClick={() => handleDeleteCommentInternal(comment.commentId)}
                                      variant="ghost"
                                      className="post_details-delete_btn hover:bg-transparent"
                                    >
                                      <img src={"/assets/icons/delete.svg"} alt="delete" width={20} height={20} />
                                    </Button>
                                  </div>
                                )}
                              </div>
                              <div className='h-full'>
                                <p className="text-white text-l">{comment.commentText}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
          </div>
          <CommentFormMobile
            onSubmit={(formData: { comment: string }) => handleNewComment(formData.comment)}
            className={commentFormClassName}
            onCancel={() => {}}
            />
        </div>
      </div>
    </div>
  );
};

export default PopupComment;
