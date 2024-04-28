import React, { useState } from "react";

const dummyUserData = {
  fullName: "John Doe",
  email: "john@example.com",
  contact: "+1234567890",
  address:
    "123 Main St, City, Country123 Main St, City, Country123 Main St, City, Country123 Main St, City, Country123 Main St, City, Country123 Main St, City, Country123 Main St, City, Country",
  qualification: "Bachelor's Degree in Computer Science",
  imageUrl: "https://avatar.iran.liara.run/public/boy", // Placeholder image URL
};

function ProfilePage({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...dummyUserData });

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    // Here you can perform any action with the editedUser data
    // For example, you can send it to an API for updating the user data
    console.log("Edited user data:", editedUser);
    // Once saved, toggle back to read-only mode
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Your Profile</h1>
      <hr className="my-4" />
      <div>second</div>
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex justify-center">
          <img
            className="w-32 h-32 rounded-full mt-6"
            src={dummyUserData.imageUrl}
            alt="Profile"
          />
        </div>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
          {/* Full Name */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block font-medium mb-1">
              Full Name:
            </label>
            {isEditing ? (
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={editedUser.fullName}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 "
              />
            ) : (
              <p className="w-full bg-gray-100 rounded-md p-2 text-gray-800">
                {editedUser.fullName}
              </p>
            )}
          </div>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-1">
              Email:
            </label>
            {isEditing ? (
              <input
                type="email"
                id="email"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 "
              />
            ) : (
              <p className="w-full bg-gray-100 rounded-md p-2 text-gray-800">
                {editedUser.email}
              </p>
            )}
          </div>
          {/* Contact Details */}
          <div className="mb-4">
            <label htmlFor="contact" className="block font-medium mb-1">
              Contact Number:
            </label>
            {isEditing ? (
              <input
                type="text"
                id="contact"
                name="contact"
                value={editedUser.contact}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 "
              />
            ) : (
              <p className="w-full bg-gray-100 rounded-md p-2 text-gray-800">
                {editedUser.contact}
              </p>
            )}
          </div>
          {/* Address */}
          <div className="mb-4">
            <label htmlFor="address" className="block font-medium mb-1">
              Address:
            </label>
            {isEditing ? (
              <textarea
                id="address"
                name="address"
                rows="3"
                value={editedUser.address}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 resize-none"
              ></textarea>
            ) : (
              <p className="w-full bg-gray-100 rounded-md p-2 text-gray-800">
                {editedUser.address}
              </p>
            )}
          </div>
          {/* Higher Qualification */}
          <div className="mb-4">
            <label htmlFor="qualification" className="block font-medium mb-1">
              Higher Qualification:
            </label>
            {isEditing ? (
              <input
                type="text"
                id="qualification"
                name="qualification"
                value={editedUser.qualification}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 "
              />
            ) : (
              <p className="w-full bg-gray-100 rounded-md p-2 text-gray-800">
                {editedUser.qualification}
              </p>
            )}
          </div>
          {/* Edit Button */}
          <div className="flex justify-end">
            {isEditing ? (
              <button
                onClick={handleSaveClick}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleEditClick}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
      <hr className="my-4" />
    </div>
  );
}

export default ProfilePage;
