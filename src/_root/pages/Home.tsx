import { Models } from "appwrite";
import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";
import PullToRefresh from 'react-pull-to-refresh';
import { useState } from "react";

const Home = () => {
  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
    refetch: refetchPosts,
  } = useGetRecentPosts();
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchPosts();
    setRefreshing(false);
  };

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-1 h-full">
      <div className="home-container flex-1 overflow-auto !gap-0">
        <div className="flex justify-between w-full pb-5">
          <h2 className="h3-bold md:h2-bold text-left pl-2 w-1/2">Home Feed</h2>
        <PullToRefresh onRefresh={handleRefresh} className="w-full overflow-y-auto ">
          <h2 className="pb-10 w-full"></h2>
          </PullToRefresh>
        </div>
          <div className="home-posts">
            {isPostLoading || refreshing ? (
              <Loader />
            ) : (
              <ul className="flex flex-col flex-1 gap-9 w-full">
                {posts?.documents.map((post: Models.Document) => (
                  <li key={post.$id} className="flex justify-center w-full">
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>
            )}
          </div>
      </div>

      <div className="home-creators w-1/4 overflow-auto">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
