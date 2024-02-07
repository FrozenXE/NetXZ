import { Button } from "../ui/button";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { useFollowUser, useIsFollowingQuery, useUnfollowUser, useCurrentUser } from "@/lib/react-query/queries";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  const { data: currentUser } = useCurrentUser();
  const { data: isFollowingUser, refetch } = useIsFollowingQuery(user.$id); // Destructure refetch function
  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();

  const handleFollow = async () => {
    try {
      await followUserMutation.mutateAsync(user.$id);
      refetch(); // Manually trigger refetch after successful follow
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUserMutation.mutateAsync(user.$id);
      refetch(); // Manually trigger refetch after successful unfollow
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  if (currentUser?.$id === user.$id) {
    return null;
  }

  return (
    <div className="user-card flex">
      <Link to={`/profile/${user.$id}`} className="flex flex-col items-center">
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="creator"
          className="rounded-full w-14 h-14"
        />
        <div className="flex-center flex-col gap-1">
          <p className="base-medium text-light-1 text-center line-clamp-1">
            {user.name}
          </p>
          <p className="small-regular text-light-3 text-center line-clamp-1">
            @{user.username}
          </p>
        </div>
      </Link>
      {currentUser?.$id !== user.$id && isFollowingUser !== undefined && ( 
        <Button
          type="button"
          size="sm"
          className="shad-button_primary px-5"
          onClick={isFollowingUser ? handleUnfollow : handleFollow}
        >
          {isFollowingUser ? "Unfollow" : "Follow"}
        </Button>
      )}
    </div>
  );
};

export default UserCard;
