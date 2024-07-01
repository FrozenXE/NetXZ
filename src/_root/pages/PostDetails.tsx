import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { Loader } from "@/components/shared";
import { GridPostList } from "@/components/shared";
import { useGetPostById, useGetUserPosts, useDeletePost as useDeletePostMutation } from "@/lib/react-query/queries";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { getCommentsData, CommentData, deleteComment, editComment } from "@/lib/appwrite/api";
import CommentRender from "@/components/shared/CommentRender";
import PostOptions from "@/components/shared/PostOptions";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();

  const { data: post, isLoading } = useGetPostById(id);
  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(post?.creator.$id);
  const { mutate: deletePost } = useDeletePostMutation();

  const relatedPosts = userPosts?.documents.filter((userPost) => userPost.$id !== id);

  const [commentsData, setCommentsData] = useState<CommentData[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const postComments = commentsData.filter((comment) => comment.postId === id);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getCommentsData();
        setCommentsData(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsCommentsLoading(false);
      }
    };

    fetchComments();
  }, [id]);

  const handleDeletePost = async () => {
    try {
      await deletePost({ postId: id, imageId: post?.imageId });
      navigate(-1);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
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

  return (
    <div className="post_details-container w-full">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img src={"/assets/icons/back.svg"} alt="back" width={24} height={24} />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card flex flex-col md:flex-row !rounded-lg items-stretch md:items-start justify-normal w-full h-full">
          {post.imageUrl && (
            <div className="md:w-full xl:w-1/2 md:h-full">
              <img src={post.imageUrl} alt="creator" className=" !rounded-lg !rounded-r-none post_details-img md:w-full !p-0 w-full object-cover h-full " />
            </div>
          )}
          <div className="post_details-info xl:w-1/2 md:full flex flex-col p-4 md:pl-6 overflow-auto h-full">
            <div className="flex-between w-full">
              <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
                <img
                  src={post?.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-white">
                    {post?.creator.name}
                  </p>
                  <div className="flex gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}>
                  <img src={"/assets/icons/edit.svg"} alt="edit" width={24} height={24} />
                </Link>

                {user.id === post?.creator.$id && (
                  <Button
                    onClick={handleDeletePost}
                    variant="destructive"
                    className="post_details-delete_btn"
                  >
                    <img src={"/assets/icons/delete.svg"} alt="delete" width={24} height={24} />
                  </Button>
                )}

              </div>
            </div>

            <hr className="border w-full border-slate-800" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular text-white">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string, index: string) => (
                  <li key={`${tag}${index}`} className="text-white small-regular">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="comments-section mt-4 flex-grow overflow-auto md:h-full w-full justify-center scrollbar-hide">
              {isCommentsLoading ? (
                <Loader />
              ) : (
                <ul className="space-y-4">
                  {postComments.map((comment) => (
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

            <div className="w-full mt-4">
              {editingCommentId === null && (
            <div>
              <hr className="border w-full border-slate-800 mb-5" />
              <PostOptions post={post} userId={user.id} />
            </div>
            )}
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
