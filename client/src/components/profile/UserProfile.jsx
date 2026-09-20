import { useEffect, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserAction } from "../../redux/actions/userActions";
import PostOnProfile from "../post/PostOnProfile";
import OwnProfileCard from "./OwnProfileCard";
import CommonLoading from "../loader/CommonLoading";
import OwnInfoCard from "./OwnInfoCard";
import NoPost from "../../assets/nopost.jpg";

const MemoizedPostOnProfile = memo(PostOnProfile);

const UserProfile = ({ userData }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user?.user);
  const posts = user?.posts;

  useEffect(() => {
    if (!userData?._id) return;

    setLoading(true);

    const fetchUser = async () => {
      await dispatch(getUserAction(userData._id));
    };

    fetchUser().finally(() => setLoading(false));
  }, [dispatch, userData?._id]);

  const postToShow = posts?.map((post) => (
    <MemoizedPostOnProfile key={post._id} post={post} />
  ));

  if (loading || !user || !posts) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <CommonLoading />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">

      {/* Profile header */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <OwnProfileCard user={user} />
      </div>

      {/* Profile information */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <OwnInfoCard user={user} />
      </div>

      {/* Posts section */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Your Posts
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Your most recent posts on Nexora
              </p>
            </div>

            <div className="rounded-full bg-purple-50 px-3 py-1 text-sm font-semibold text-primary">
              {posts.length}
            </div>
          </div>
        </div>

        {/* Posts */}
        {postToShow?.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

            <img
              className="mb-5 w-56 max-w-full rounded-2xl opacity-90"
              src={NoPost}
              alt="No posts"
            />

            <h4 className="text-lg font-semibold text-gray-700">
              No posts yet
            </h4>

            <p className="mt-1 max-w-sm text-sm text-gray-400">
              You haven't posted anything yet. Share something with the
              Nexora community!
            </p>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {postToShow}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;