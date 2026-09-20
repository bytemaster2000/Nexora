import { useRef, useState, useEffect, memo } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Search from "./Search";
import { logoutAction } from "../../redux/actions/authActions";
import { IoLogOutOutline } from "react-icons/io5";
import { Transition } from "@headlessui/react";
import { AiOutlineBars } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import Logo from "../../assets/Nexora.png";

const Navbar = ({ userData, toggleLeftbar, showLeftbar }) => {
  const dispatch = useDispatch();

  const [loggingOut, setLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const logout = async () => {
    setLoggingOut(true);
    await dispatch(logoutAction());
    setLoggingOut(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-20 mb-5 border-b border-gray-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md md:px-10 lg:px-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">

        {/* Mobile Menu */}
        <button
          className="rounded-xl p-2 text-gray-700 transition hover:bg-purple-50 hover:text-purple-600 md:hidden"
          onClick={toggleLeftbar}
          aria-label="Toggle menu"
        >
          {showLeftbar ? (
            <RxCross1 size={22} />
          ) : (
            <AiOutlineBars size={24} />
          )}
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
        >
          <img
            className="h-10 w-auto object-contain"
            src={Logo}
            alt="Nexora"
          />

          <span className="hidden text-xl font-bold tracking-tight text-gray-900 sm:block">
            Nexora
          </span>
        </Link>

        {/* Search */}
        <div className="flex flex-1 justify-center px-2 md:px-8">
          <div className="w-full max-w-md">
            <Search />
          </div>
        </div>

        {/* Profile */}
        <div
          ref={dropdownRef}
          className="relative flex items-center justify-end"
        >
          <button
            type="button"
            className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 pr-2 shadow-sm transition hover:border-purple-300 hover:shadow-md"
            onClick={handleProfileClick}
          >
            <img
              src={userData.avatar}
              alt="profile"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-purple-100 transition group-hover:ring-purple-300"
            />

            <span className="hidden max-w-[100px] truncate text-sm font-medium text-gray-700 md:block">
              {userData.name}
            </span>

            <span className="hidden text-gray-400 md:block">⌄</span>
          </button>

          {/* Dropdown */}
          <Transition
            show={showDropdown}
            enter="transition ease-out duration-150 transform"
            enterFrom="opacity-0 scale-95 -translate-y-2"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-100 transform"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 -translate-y-2"
          >
            {() => (
              <div
                className="absolute right-0 top-12 w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={userData.avatar}
                      alt="profile"
                      className="h-14 w-14 rounded-full object-cover ring-4 ring-white/30"
                    />

                    <div className="min-w-0 text-white">
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="block truncate font-semibold hover:underline"
                      >
                        {userData.name}
                      </Link>

                      <p className="truncate text-sm text-purple-100">
                        {userData.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2">
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="block rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-purple-50 hover:text-purple-600"
                  >
                    View Profile
                  </Link>

                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm text-red-500 transition hover:bg-red-50 hover:text-red-600"
                    role="menuitem"
                    onClick={logout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? (
                      <span className="w-full text-center">
                        Logging out...
                      </span>
                    ) : (
                      <>
                        <span>Logout</span>
                        <IoLogOutOutline size={20} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </Transition>
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);