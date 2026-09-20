import { memo, useMemo, useEffect, useState, useCallback } from "react";
import {
  getPostsAction,
  clearPostsAction,
} from "../../redux/actions/postActions";
import { useSelector, useDispatch } from "react-redux";
import Post from "../post/Post";
import CommonLoading from "../loader/CommonLoading";
import Home from "../../assets/home.jpg";

const MemoizedPost = memo(Post);

const LoadMoreButton = ({ onClick, isLoading }) => (
  <button
    className="bg-primary hover:bg-blue-700 text-sm text-white font-semibold rounded-md w-full p-2 my-3"
    onClick={onClick}
    disabled={isLoading}
  >
    {isLoading ? "Loading..." : "Load More Posts"}
  </button>
);

const MainSection = ({ userData }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const posts = useSelector((state) => state.posts?.posts);
  const totalPosts = useSelector((state) => state.posts?.totalPosts);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);

  const LIMIT = 10;

  useEffect(() => {
    if (userData) {
      dispatch(getPostsAction(LIMIT, 0)).finally(() => {
        setIsLoading(false);
      });
    }

    return () => {
      dispatch(clearPostsAction());
    };
  }, [userData, dispatch, LIMIT]);

  const handleLoadMore = useCallback(() => {
    setIsLoadMoreLoading(true);
    dispatch(getPostsAction(LIMIT, posts.length)).finally(() => {
      setIsLoadMoreLoading(false);
    });
  }, [dispatch, LIMIT, posts.length]);

  const memoizedPosts = useMemo(() => {
    return posts.map((post) => <MemoizedPost key={post._id} post={post} />);
  }, [posts]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CommonLoading />
      </div>
    );
  }
  return (
    <>
      <div>{memoizedPosts}</div>

      {posts.length > 0 && posts.length < totalPosts && (
        <LoadMoreButton
          onClick={handleLoadMore}
          isLoading={isLoadMoreLoading}
        />
      )}

      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center shadow-sm">
        <div className="mb-5 rounded-full bg-indigo-50 px-5 py-2">
          <span className="text-sm font-semibold text-indigo-600">
            Welcome to Nexora
          </span>
        </div>

        <img
       loading="lazy"
        src={Home}
        alt="Nexora community"
        className="mb-6 w-full max-w-md rounded-xl"
      />

      <h2 className="text-xl font-bold text-gray-800">
      Your feed is waiting for you
      </h2>

    <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
      Join a community and start sharing posts with people who share your
      interests.
    </p>
  </div>
)}
    </>
  );
};

export default MainSection;
