import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotJoinedCommunitiesAction } from "../../redux/actions/communityActions";
import {
  getPublicUsersAction,
  followUserAndFetchData,
} from "../../redux/actions/userActions";
import { Link, useLocation, useNavigate } from "react-router-dom";
import JoinModal from "../modals/JoinModal";
import { BsPersonPlusFill } from "react-icons/bs";
import { IoIosPeople, IoMdPeople } from "react-icons/io";
import placeholder from "../../assets/placeholder.png";

const Rightbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [joinModalVisibility, setJoinModalVisibility] = useState({});
  const [notJoinedCommunitiesFetched, setNotJoinedCommunitiesFetched] =
    useState(false);
  const [publicUsersFetched, setPublicUsersFetched] = useState(false);
  const [followLoading, setFollowLoadingState] = useState({});

  const currentUser = useSelector((state) => state.auth?.userData);

  const recommendedUsers = useSelector(
    (state) => state.user?.publicUsers
  );

  const notJoinedCommunities = useSelector(
    (state) => state.community?.notJoinedCommunities
  );

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getNotJoinedCommunitiesAction());
      setNotJoinedCommunitiesFetched(true);

      await dispatch(getPublicUsersAction());
      setPublicUsersFetched(true);
    };

    fetchData();
  }, [dispatch]);

  const [visibleCommunities, remainingCount] = useMemo(() => {
    const visible = notJoinedCommunities?.slice(0, 4) || [];
    const remaining = Math.max(
      (notJoinedCommunities?.length || 0) - 4,
      0
    );

    return [visible, remaining];
  }, [notJoinedCommunities]);

  const followUserHandler = useCallback(
    async (toFollowId) => {
      setFollowLoadingState((prevState) => ({
        ...prevState,
        [toFollowId]: true,
      }));

      await dispatch(
        followUserAndFetchData(toFollowId, currentUser)
      );

      setFollowLoadingState((prevState) => ({
        ...prevState,
        [toFollowId]: false,
      }));

      navigate(`/user/${toFollowId}`);
    },
    [dispatch, currentUser, navigate]
  );

  const toggleJoinModal = useCallback((communityId, visible) => {
    setJoinModalVisibility((prev) => ({
      ...prev,
      [communityId]: visible,
    }));
  }, []);

  const currentLocation = useLocation().pathname;

  return (
    <div className="hidden rightbar overflow-auto">
      {/* Suggested Communities */}
      {currentLocation !== "/communities" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h5 className="text-base font-bold text-gray-800">
              Suggested Communities
            </h5>

            {remainingCount > 0 && (
              <Link
                className="text-xs font-semibold text-indigo-600 hover:text-purple-600"
                to="/communities"
              >
                See all
              </Link>
            )}
          </div>

          {notJoinedCommunitiesFetched &&
            visibleCommunities.length === 0 && (
              <div className="rounded-xl bg-gray-50 px-4 py-5 text-center text-sm italic text-gray-400">
                No communities to join.
                <br />
                Check back later
              </div>
            )}

          <ul className="flex flex-col gap-3">
            {visibleCommunities?.map((community) => (
              <li
                key={community._id}
                className="flex w-full items-center justify-between gap-2 overflow-hidden rounded-xl border border-gray-100 bg-white px-3 py-3 shadow-sm transition duration-200 hover:shadow-md"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <img
                    src={community.banner || placeholder}
                    className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                    alt="community"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {community.name}
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                      <IoMdPeople />
                      {community.members.length} members
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    toggleJoinModal(community._id, true)
                  }
                  className="flex-shrink-0 rounded-lg border border-indigo-200 px-2 py-1 text-xs font-semibold text-indigo-600 transition duration-200 hover:bg-indigo-600 hover:text-white"
                >
                  <span className="flex items-center gap-1">
                    <IoIosPeople className="text-base" />
                    Join
                  </span>
                </button>

                <JoinModal
                  show={
                    joinModalVisibility[community._id] || false
                  }
                  onClose={() =>
                    toggleJoinModal(community._id, false)
                  }
                  community={community}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Divider */}
      <div className="my-5 border-t border-gray-100" />

      {/* Popular Users */}
      <h5 className="mb-4 text-base font-bold text-gray-800">
        Popular Users to Follow
      </h5>

      {publicUsersFetched &&
        recommendedUsers?.length === 0 && (
          <div className="rounded-xl bg-gray-50 px-4 py-5 text-center text-sm italic text-gray-400">
            No users to follow.
            <br />
            Check back later
          </div>
        )}

      <ul className="flex flex-col gap-3">
        {recommendedUsers?.length > 0 &&
          recommendedUsers.map((user) => (
            <li
              key={user._id}
              className="flex w-full items-center gap-2 overflow-hidden rounded-xl border border-gray-100 bg-white px-3 py-3 shadow-sm transition duration-200 hover:shadow-md"
            >
              {/* User information */}
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <img
                  className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                  src={user.avatar}
                  alt={user.name}
                />

                <div className="min-w-0 flex-1">
                  <Link
                    to={`/user/${user._id}`}
                    className="block truncate text-sm font-semibold text-gray-800 hover:text-indigo-600"
                  >
                    {user.name}
                  </Link>

                  <div className="truncate text-xs text-gray-400">
                    Followers: {user.followerCount}
                  </div>
                </div>
              </div>

              {/* Follow button */}
              <button
                disabled={followLoading[user._id]}
                onClick={() => followUserHandler(user._id)}
                className="flex h-8 flex-shrink-0 items-center justify-center rounded-lg border border-indigo-200 px-2 text-xs font-semibold text-indigo-600 transition duration-200 hover:bg-indigo-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {followLoading[user._id] ? (
                  <span className="loader"></span>
                ) : (
                  <span className="flex items-center gap-1">
                    <BsPersonPlusFill className="text-xs" />
                    Follow
                  </span>
                )}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Rightbar;