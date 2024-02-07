import { Models } from "appwrite";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CommentForm from '@/components/shared/CommentForm';
import { checkIsLiked } from "@/lib/utils";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
} from "@/lib/react-query/queries";
import { CommentData, createComment, deleteComment, editComment, getCommentsData } from "@/lib/appwrite/api";
import PopupComment from "./popupComment";
import { useUserContext } from "@/context/AuthContext";


type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats: React.FC<PostStatsProps> = ({ post, userId }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showPopupComment, setShowPopupComment] = useState(false); 
  const [commentsData, setCommentsData] = useState<CommentData[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [loadingComments, setLoadingComments] = useState(false); 
  const { user } = useUserContext();

  const location = useLocation();
  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavePost } = useDeleteSavedPost();

  const { data: currentUser, refetch: refetchCurrentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    refetchCurrentUser();
  }, [userId, refetchCurrentUser]);

  useEffect(() => {
    const savedPostRecord = currentUser?.save.find(
      (record: Models.Document) => record.post.$id === post.$id
    );

    if (savedPostRecord) {
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  }, [currentUser, post.$id]);

  const handleCommentClick = () => {
    setShowCommentForm((prev) => !prev);
    setShowPopupComment(false);
  };

  const handleCommentMobile = async () => {
    setShowPopupComment(true); 
    try {
      setLoadingComments(true);
      const data = await getCommentsData();
      setCommentsData(data);
    } catch (error) {
      console.error("Error fetching comments:", error);

    } finally {
      setLoadingComments(false); 
    }
  };

  const handleEditComment = async (commentId: string, updatedCommentText: string) => {
    try {
      const updatedComment = await editComment(commentId, {
        commentText: updatedCommentText,
      });
      const updatedCommentsData = commentsData.map((comment) =>
        comment.commentId === commentId ? updatedComment : comment
      );
      setCommentsData(updatedCommentsData);
      setEditingCommentId(null);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
  };
  const handleEditButtonClick = (commentId: string) => {
    setEditingCommentId(commentId);
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      const updatedCommentsData = commentsData.filter((comment) => comment.commentId !== commentId);
      setCommentsData(updatedCommentsData);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    likePost({ postId: post.$id, likesArray });
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (savedPostRecord) {
      setIsSaved(false);
      return deleteSavePost(savedPostRecord.$id);
    }
    savePost({ userId: userId, postId: post.$id });
    console.log(savePost)
    setIsSaved(true);
  };

  const handleCommentFormSubmit = async (formData: { comment: string }) => {
    try {
      const commentText = formData.comment;
      const postId = post.$id
      await createComment(commentText, postId);
  
      setShowCommentForm(false);
    } catch (error: any) {
      console.error('Error creating comment:', error.message);
      }
  };
  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <>
      <div
        className={`flex justify-between items-center z-20 ${containerStyles}`}>
          <div className="flex flex-row">
            <div className="flex gap-2 mr-5">
              <img
                src={`${
                  checkIsLiked(likes, userId)
                  ? "/assets/icons/liked.svg"
                  : "/assets/icons/like.svg"
                }`}
                alt="like"
                width={21}
                height={20}
                onClick={(e) => handleLikePost(e)}
                className="cursor-pointer"
                />
              <p className="lg:base-medium">{likes.length}</p>
            </div>

            <div className="flex gap-2 mr-5 max-lg:hidden">
              <img
                src={"/assets/icons/comment.svg"}
                alt="comment"
                width={25}
                height={20}
                className="cursor-pointer"
                onClick={handleCommentClick}
                />
            </div>
            
            <div className="flex gap-2 mr-5 md:hidden">
            <img
              src={"/assets/icons/comment.svg"}
              alt="comment"
              width={25}
              height={20}
              className="cursor-pointer"
              onClick={handleCommentMobile}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={(e) => handleSavePost(e)}
          />
        </div>
      </div>
      <div>
      <div>
        {showCommentForm && <CommentForm onSubmit={handleCommentFormSubmit} />}
        {showPopupComment && (
        <PopupComment
          onClose={() => setShowPopupComment(false)}
          comments={commentsData}
          editingCommentId={editingCommentId}
          handleEditComment={handleEditComment}
          handleCancelEdit={handleCancelEdit}
          user={user}
          handleEditButtonClick={handleEditButtonClick}
          handleDeleteComment={handleDeleteComment}
          loading={loadingComments}
          postId={post.$id}
          handleCommentFormSubmit={handleCommentFormSubmit}
        />
      )}

      </div>
    </div>
    </>
  );
};

export default PostStats;
