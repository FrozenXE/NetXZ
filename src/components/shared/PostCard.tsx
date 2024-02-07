import { Models } from "appwrite";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PostStats } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "../ui/button";
import { useDeletePost } from "@/lib/react-query/queries";
import ConfirmationDelete from "../forms/ConfirmationDelete";
import { useToast } from "../ui/use-toast";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  const { toast } = useToast();
  const [isDeleted, setIsDeleted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { mutate: deletePost } = useDeletePost();

  if (!post.creator || isDeleted) return null;

  const handleDeletePost = async () => {
    try {
      await deletePost({ postId: post.$id, imageId: post?.imageId });
      setIsDeleted(true);
      setShowConfirmation(false);
      toast({
        title: `Post succesfully deleted.`,
      });
    } catch (error) {
      toast({
        title: `Post failed to delete, Please try again.`,
      });
    }
  };

  return (
    <div className="post-card">
      {showConfirmation && (
        <ConfirmationDelete onCancel={() => setShowConfirmation(false)} onDelete={handleDeletePost} />
      )}
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.$createdAt)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-center gap-3">
          <Link
            to={`/update-post/${post.$id}`}
            className={`${user.id !== post.creator.$id && "hidden"}`}
          >
            <img src={"/assets/icons/edit.svg"} alt="edit" width={20} height={20} />
          </Link>

          {user.id === post.creator.$id && (
            <Button
              onClick={() => setShowConfirmation(true)}
              variant={'destructive'}
              className="post_details-delete_btn"
            >
              <img src={"/assets/icons/delete.svg"} alt="delete" width={24} height={24} />
            </Button>
          )}
        </div>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string, index: string) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="post image"
            className="post-card_img"
          />
        )}
      </Link>

      <PostStats post={post} userId={user.id}/>
    </div>
  );
};

export default PostCard;
