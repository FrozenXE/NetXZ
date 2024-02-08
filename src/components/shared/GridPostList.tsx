import { Models } from "appwrite";
import { Link } from "react-router-dom";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
}: GridPostListProps) => {
  return (
    <ul className="grid-container !gap-0">
      {posts.map((post) => (
        post.imageUrl && (
          <li key={post.$id} className="relative min-w-80 h-80 ">
            <Link to={`/posts/${post.$id}`} className="grid-post_link !rounded-none">
              <img
                src={post.imageUrl}
                alt="post"
                className="h-full w-full object-cover"
              />
            </Link>
            <div className="grid-post_user !rounded-none">
              {showUser && post.creator && (
                <div className="flex items-center justify-start gap-2 flex-1">
                  <img
                    src={
                      post.creator.imageUrl ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                    alt="creator"
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="line-clamp-1">{post.creator.name}</p>
                </div>
              )}
            </div>
          </li>
        )
      ))}
    </ul>
  );
};

export default GridPostList;
