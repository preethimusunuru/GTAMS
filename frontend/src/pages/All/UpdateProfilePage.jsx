import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { getUserData, updateProfile } from "../../Redux/authSlice";
import { useNavigate } from "react-router-dom";

function UpdateProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    let res = dispatch(updateProfile(user));

    await toast.promise(res, {
      loading: "Updating profile...",
      success: (data) => data?.payload?.message,
      error: (data) => data?.response?.data.message,
    });

    res = await res;
    if (res.payload.success) {
      navigate(-1);
    }
  };

  const getUser = async () => {
    let res = dispatch(getUserData());

    await toast.promise(res, {
      loading: "Fetching profile...",
      success: (data) => data?.payload?.message,
      error: (data) => data?.response?.data.message,
    });

    res = await res;
    setUser(res.payload.user);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="sm:p-1 h-full w-full lg:min-h-screen bg-slate-50" style={{ minHeight: "85vh" }}>
      <div className="sm:m-1 lg:m-4 ">
        <div className="flex flex-col p-4  border-gray-500  rounded-xl m-3 items-center shadow-md mt-6 bg-white">
          <img
            src="https://avatar.iran.liara.run/public/boy"
            alt="image of user"
            className="w-32 h-32 mb-0.5 hover:border-2 rounded-full border-gray-400"
          />
          <div className="w-half text-gray-700 rounded-md lg:text-md text-center font-bold font-sans">
            {user.fullName}
          </div>
        </div>

        <div className="block  border-gray-400 rounded-xl p-5 m-3 shadow-md bg-white ">
          <div className="flex items-center">
            <CgProfile className="h-12 w-12 mr-4 text-gray-800" />
            <span className="text-2xl font-sans font-semibold"> Contact Details</span>
          </div>

          <table className="text-gray-800">
            <col style={{ width: "15%" }} />
            <col style={{ width: "60%" }} />
            <tbody className="">
              <tr>
                <td className="p-2 font-semibold align-top">Name</td>
                <td className="p-2 align-top">
                  <input
                    type="text"
                    placeholder="Enter your Name"
                    className="p-1 px-2 w-5/6 border border-gray-500 rounded-md"
                    value={user.fullName}
                    name="fullName"
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 font-semibold align-top">Email</td>
                <td className="p-2 align-top">
                  <input
                    type="text"
                    placeholder="Enter your email"
                    className="p-1 px-2 w-5/6 border border-gray-500 rounded-md cursor-not-allowed"
                    value={user.email}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 font-semibold align-top">Contact</td>
                <td className="p-2 align-top">
                  <input
                    type="text"
                    placeholder="Enter your contact"
                    className="p-1 px-2 w-5/6 border border-gray-500 rounded-md"
                    value={user.phone}
                    onChange={handleInputChange}
                    name="phone"
                  />
                </td>
              </tr>

              <tr>
                <td className="p-2 font-semibold align-top">Permanent Address</td>
                <td className="p-2 align-top">
                  <input
                    type="text"
                    placeholder="Permanent Address"
                    className="p-1 px-2 w-5/6 border border-gray-500 rounded-md"
                    value={user?.address}
                    onChange={handleInputChange}
                    name="address"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <button onClick={() => navigate(-1)} className=" border-gray-500 bg-white-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold py-2 px-8 rounded-md m-3 shadow-md bg-white">
            Cancel
          </button>
          <button onClick={handleSaveClick} className=" border-gray-500 bg-white-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold py-2 px-8 rounded-md m-3 shadow-md bg-white ">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfilePage;
