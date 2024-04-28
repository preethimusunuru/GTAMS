import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { useDispatch } from "react-redux";
import { getUserData } from "../../Redux/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleEditClick = () => {
    navigate("/update-profile");
  };

  const getUser = async () => {
    let res = dispatch(getUserData());

    // await toast.promise(res, {
    //   loading: "Fetching profile...",
    //   success: (data) => {
    //     // Success toast
    //     return data?.payload?.message;
    //   },
    //   error: (data) => {
    //     // Error toast
    //     return data?.response?.data.message;
    //   },
    // });

    res = await res;
    setUser(res.payload.user);
  };

  useEffect(() => {
    getUser();
  }, [setUser]);

  return (
    <div
      className="sm:p-1 h-full w-full lg:min-h-screen bg-slate-50"
      style={{ minHeight: "85vh" }}
    >
      <div className="sm:m-1 lg:m-4">
        <div className="flex flex-col p-4 border-gray-500 rounded-xl m-3 items-center shadow-md mt-6 bg-white">
          <img
            src="https://avatar.iran.liara.run/public/boy"
            alt="image of user"
            className="w-32 h-32 mb-0.5 hover:border-2 rounded-full border-red-200"
          />
          <div className="w-half text-gray-700 rounded-md lg:text-md text-center font-bold font-sans">
            {/* Displaying user's full name */}
            {user.fullName}
          </div>
        </div>

        <div className="block border-gray-400 rounded-xl p-5 m-3 shadow-md bg-white">
          <div className="flex items-center">
            <CgProfile className="h-12 w-12 mr-4 text-gray-800" />
            <span className="text-2xl font-sans font-semibold">
              Contact Details
            </span>
          </div>

          <table className="text-gray-800">
            <colgroup>
              <col style={{ width: "40%" }} />
              <col style={{ width: "60%" }} />
            </colgroup>

            <tbody>
              {/* Displaying user's contact details */}
              <tr >
                <td className="p-2 font-semibold align-top">Name</td>
                <td className="p-2 align-top">{user?.fullName}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold align-top">Email</td>
                <td className="p-2 align-top">{user?.email}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold align-top">Phone</td>
                <td className="p-2 align-top">{user?.phone}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold align-top">Role</td>
                <td className="p-2 align-top">
                  {/* Displaying user's role */}
                  {user?.role === "USER" && "TA/User"}
                  {user?.role === "INS" && "Instructor"}
                  {user?.role === "ADMIN" && "Admin"}
                  {user?.role === "TACM" && "TA Committee member"}
                  {user?.role === "DS" && "Dept Staff"}
                </td>
              </tr>
              <tr>
                <td className="p-2 font-semibold align-top">Address</td>
                <td className="p-2 align-top">{user?.address}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          {/* Button to edit profile */}
          <button
            className="border-gray-500 bg-white text-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-2 px-8 rounded-md m-3 shadow-md"
            onClick={handleEditClick}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
