import { useMemo, useEffect, memo } from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getJoinedCommunitiesAction } from "../../redux/actions/communityActions";
import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineRectangleStack,
  HiOutlineTag,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { GiTeamIdea } from "react-icons/gi";

const Leftbar = ({ showLeftbar }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth?.userData);

  const joinedCommunities = useSelector(
    (state) => state.community?.joinedCommunities
  );

  useEffect(() => {
    dispatch(getJoinedCommunitiesAction());
  }, [dispatch]);

  const visibleCommunities = useMemo(() => {
    return joinedCommunities?.slice(0, 5) || [];
  }, [joinedCommunities]);

  const communityLinks = useMemo(() => {
    return visibleCommunities.map((community) => ({
      href: `/community/${community.name}`,
      label: community.name,
    }));
  }, [visibleCommunities]);

  const menuItems = [
    {
      to: "/",
      label: "Home",
      icon: HiOutlineHome,
    },
    {
      to: "/profile",
      label: "Profile",
      icon: HiOutlineUserCircle,
    },
    {
      to: "/saved",
      label: "Saved",
      icon: HiOutlineTag,
    },
    ...(user?.role === "general"
      ? [
          {
            to: "/following",
            label: "Following",
            icon: HiOutlineRectangleStack,
          },
        ]
      : []),
  ];

  return (
    <div className={`${showLeftbar ? "" : "hidden"} leftbar`}>
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col p-4">

          {/* Main Navigation */}
          <nav className="space-y-1">
            {menuItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                  }`
                }
              >
                <Icon className="h-6 w-6 transition-transform duration-200 group-hover:scale-105" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="my-5 border-t border-gray-100" />

          {/* Communities */}
          {communityLinks.length > 0 ? (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <HiOutlineUserGroup className="h-5 w-5 text-indigo-500" />
                  <span>Communities</span>
                </div>

                <Link
                  to="/my-communities"
                  className="text-xs font-semibold text-indigo-600 transition hover:text-purple-600"
                >
                  See all
                </Link>
              </div>

              <ul className="space-y-1">
                {communityLinks.map((communityLink) => (
                  <li key={communityLink.href}>
                    <Link
                      to={communityLink.href}
                      className="block truncate rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      {communityLink.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-2 text-center">
                <Link
                  to="/my-communities"
                  className="text-xs font-semibold text-indigo-600 hover:text-purple-600"
                >
                  View all {joinedCommunities?.length || 0} communities →
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-3 text-sm text-gray-400">
              No communities found.
            </div>
          )}

          {/* Mobile Community Link */}
          {user?.role === "general" && (
            <div className="md:hidden">
              <div className="my-4 border-t border-gray-100" />

              <Link
                to="/communities"
                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
              >
                <GiTeamIdea className="h-5 w-5" />
                See all communities
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(Leftbar);