import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa"; // Importing React Icons
import { IoMdAddCircle } from "react-icons/io";
import UserForm from "../../components/UserForm";
import SearchInput from "../DeptStaffPages/SearchInput";
import axiosInstance from "../../Helper/axiosInstance";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user", // default role
  });
  const [filterRole, setFilterRole] = useState("ALL"); // Default filter role
  const [selectedRole, setSelectedRole] = useState("USER"); // Default filter role
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [showCreateForm, setShowCreateForm] = useState(false); // State to control form
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user data for editing

  const [departmentOptions, setDepartment] = useState([]);

  // Function to fetch users from backend
  const getAllUser = async () => {
    try {
      let res = axiosInstance.post(`/user/getAllUser`);

      // await toast.promise(res, {
      //   loading: "Fetching...",
      //   success: (data) => {
      //     return data?.data?.message;
      //   },
      //   error: (data) => {
      //     return data?.response?.data.message;
      //   },
      // });
      res = await res;
      // Handle success or error as needed
      setUsers(res.data.users);
    } catch (error) {
      console.error("Error Fetching users.", error);
      toast.error("Error Fetching users.");
    }
  };

  //fetching all department
  const getAllDepartment = async () => {
    try {
      let res = axiosInstance.post(`/department/getAllDepartment`);

      // await toast.promise(res, {
      //   loading: "Fetching...",
      //   success: (data) => {
      //     return data?.data?.message;
      //   },
      //   error: (data) => {
      //     return data?.response?.data.message;
      //   },
      // });
      res = await res;
      // Handle success or error as needed
      setDepartment(res.data.departments);
    } catch (error) {
      console.error("Error Fetching departments.", error);
      toast.error("Error Fetching departments.");
    }
  };

  // // Function to handle form submission for creating new user
  const handleCreateUser = async (formData) => {
    try {
      let res = axiosInstance.post(`/user/create`, formData);

      await toast.promise(res, {
        loading: "Creating...",
        success: (data) => {
          return data?.data?.message;
        },
        error: (data) => {
          return data?.response?.data.message;
        },
      });
      res = await res;
      // Handle success or error as needed
      if ((await res).data.success) {
        getAllUser();

        // Close the create form modal
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error("Error creating user", error);
      toast.error("Error creating user");
    }
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    const result = window.confirm("Are you sure you want to proceed?");
    if (result) {
      try {
        let res = axiosInstance.post(`/user/delete`, { id });

        await toast.promise(res, {
          loading: "Deleting...",
          success: (data) => {
            return data?.data?.message;
          },
          error: (data) => {
            return data?.response?.data.message;
          },
        });
        res = await res;
        // Handle success or error as needed
        getAllUser();
      } catch (error) {
        console.error("Error deleting User.", error);
        toast.error("Error deleting User.");
      }
    } else {
      toast.success("cancelled operation");
    }
  };

  // Filter users based on selected role and search term
  const filteredUsers = users.filter((user) => {
    if (filterRole !== "ALL" && user.role !== filterRole) return false;
    if (
      searchTerm &&
      !user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  // Fetch users on component mount
  useEffect(() => {
    getAllUser();
    getAllDepartment();
  }, [setUsers, setDepartment]);

  return (
    <div className="min-h-screen p-3 md:p-8 bg-slate-50">
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h1 className=" text-xl md:text-3xl md:text-medium font-semibold  mb-4 ">
          User Management
        </h1>
        <div className="w-full flex justify-between items-center mb-4">
          <SearchInput
            searchQuery={searchTerm}
            setSearchQuery={setSearchTerm}
            placeholder="Search by ID, Instructor, Title, Course ID, Department..."
          />
          <div className="w-1/3 md:w-1/4 text-right ">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 md:py-2 py-1 rounded shadow-md"
              onClick={()=>setShowCreateForm(true)}
            >
              <IoMdAddCircle className="md:hidden" size={30} />
              <span className="md:block hidden">Create User</span>
            </button>
          </div>
        </div>
      </div>

      {/**form for creating user */}

      {showCreateForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="p-4  w-11/12  bg-white md:p-6 rounded-lg lg:w-1/4">
            <h2 className="text-xl font-semibold mb-4">Create User</h2>
            {/***form component for creating user  */}
            <UserForm
              formData={formData}
              onSubmit={(formData) => {
                handleCreateUser(formData);
              }}
              onCancel={() => {
                setShowCreateForm(false);
              }}
              departmentOptions={departmentOptions}
            />
          </div>
        </div>
      )}

      {/* User List */}
      <div className="max-h-screen min-h-96 p-5 rounded-lg shadow-lg bg-white mt-6 ">
        {/* Filter dropdown */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">User List</h2>
          <div className="mb-4 ">
            <label
              htmlFor="filterRole"
              className="block text-gray-700 font-semibold"
            >
              Filter by Role:
            </label>
            <select
              id="filterRole"
              className="border border-gray-300 rounded-md px-4 py-2 shadow-sm"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="USER">User</option>
              <option value="INS">Instructor</option>
              <option value="DS">Department Staff</option>
              <option value="TACM">Committee Member</option>
            </select>
          </div>
        </div>
        <div className=" rounded-md hover:shadow-md text-sm overflow-x-auto  ">
          <table className="w-full table-auto border-collapse border-gray-300">
            <thead className="text-sm lg:text-lg">
              <tr className="bg-gray-600 text-white">
                <th className="border border-gray-300 px-2 py-2 w-1/20">
                  Sr.No.
                </th>
                <th className="border border-gray-300 px-4 py-2 w-2/5">
                  Full Name
                </th>
                <th className="border border-gray-300 px-4 py-2 w-2/5">
                  Email
                </th>
                <th className="border border-gray-300 px-3 py-2 w-1/20">
                  Role
                </th>
                <th className="border border-gray-300 px-3 py-2 w-1/20">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(
                (user, index) =>
                  user.role != "ADMIN" && (
                    <tr key={user._id}>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {user.fullName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {user.email}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {user.role}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-500 hover:text-red-600 ml-2"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
