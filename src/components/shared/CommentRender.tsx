import React from 'react';
import { Button } from "@/components/ui";
import { multiFormatDateString } from "@/lib/utils";
import EditComment from '@/_root/pages/EditComment';
import { CommentData } from '@/lib/appwrite/api';

interface CommentRenderProps {
  comment: CommentData;
  editingCommentId: string | null;
  handleEditComment: (commentId: string, updatedCommentText: string) => void;
  handleCancelEdit: () => void;
  user: any; 
  handleEditButtonClick: (commentId: string) => void;
  handleDeleteComment: (commentId: string) => void;
}

const CommentRender: React.FC<CommentRenderProps> = ({
  comment,
  editingCommentId,
  handleEditComment,
  handleCancelEdit,
  user,
  handleEditButtonClick,
  handleDeleteComment
}) => {
    return(
    <li key={comment.commentId} className="flex justify-center relative top-1/3 w-full">
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
      <div className="relative grid grid-cols-1 gap-4 border border-none rounded-lg bg-transparent w-full pt-4 pb-4">
        <div className="relative flex gap-4">
          <div className='w-1/6 m-auto'>
            <img src={comment.userImage} className="w-post_details-card m-auto flex flex-col md:flex-row items-stretch md:items-start8 h-10 lg:w-12 lg:h-12 rounded-full" />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex flex-row justify-between">
              <div className='flex-center gap-2'>
                <p className="relative text-xl text-white whitespace-nowrap truncate overflow-hidden">{comment.userName}</p>
                <p className="text-white text-sm">{multiFormatDateString(comment.createdAt)} </p>
              </div>
              {user?.id === comment.userId && (
                <div className="flex flex-row">
                  <Button
                    onClick={() => handleEditButtonClick(comment.commentId)}
                    variant="ghost"
                    className="post_details-edit_btn hover:bg-transparent"
                  >
                    <img src={"/assets/icons/edit.svg"} alt="edit" width={24} height={24} />
                  </Button>
                  <Button
                    onClick={() => handleDeleteComment(comment.commentId)}
                    variant="ghost"
                    className="post_details-delete_btn hover:bg-transparent"
                  >
                    <img src={"/assets/icons/delete.svg"} alt="delete" width={24} height={24} />
                  </Button>
                </div>
              )}
            </div>
            <div>
              <p className=" text-white text-l">{comment.commentText}</p>
            </div>
          </div>
        </div>
      </div>
    )}
  </li>

)
}
export default CommentRender;
