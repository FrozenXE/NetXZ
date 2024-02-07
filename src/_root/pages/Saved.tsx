import { useEffect, useState } from "react";
import { Models } from "appwrite";
import { GridPostList, Loader } from "@/components/shared";
import { getPostById } from "@/lib/appwrite/api"; 
import { useGetCurrentUser } from "@/lib/react-query/queries";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [savedPosts, setSavedPosts] = useState<Models.Document[]>([]);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (currentUser?.save) {
        setIsLoading(true);
        const postsPromises = currentUser.save.map(async (savePost: Models.Document) => {
          try {
            const post = await getPostById(savePost.post?.$id); // Fetch post data
            if (!post) {
              return null;
            }
            return {
              ...post,
              creator: {
                imageUrl: post.creator?.imageUrl || "/assets/icons/profile-placeholder.svg",
              },
            };
          } catch (error) {
            console.error("Error fetching post:", error);
            return null;
          }
        });
        const resolvedPosts = await Promise.all(postsPromises);
        setSavedPosts(resolvedPosts.filter((post) => post !== null) as Models.Document[]);
        setIsLoading(false);
      }
    };
    fetchSavedPosts();
  }, [currentUser]);

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savedPosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={savedPosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
