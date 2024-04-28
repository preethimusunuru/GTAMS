import React, { useState, useEffect } from "react";

const UserForm = ({ initialFormData, onSubmit, onCancel, departmentOptions }) => {
  const [formData, setFormData] = useState(initialFormData || {
    fullName: "",
    email: "",
    password: "",
    role: "USER",
    department: ""
  });

  useEffect(() => {
    setFormData(initialFormData || {
      fullName: "",
      email: "",
      password: "",
      role: "USER",
      department: ""
    });
  }, [initialFormData]);

  const [selectedRole, setSelectedRole] = useState("USER");

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // Optionally, clear form fields after submission
    setFormData({
      fullName: "",
      email: "",
      password: "",
      role: "USER",
      department: ""
    });
  };

  return (

    <form onSubmit={handleSubmit} className="mb-8 ">
      <div className="mb-4">
        <label htmlFor="fullName" className="block text-gray-700 font-semibold">
          Full Name:
        </label>
        <input
          type="text"
          id="fullName"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-semibold">
          Email:
        </label>
        <input
          type="email"
          id="email"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 font-semibold">
          Password:
        </label>
        <input
          type="password"
          id="password"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="role" className="block text-gray-700 font-semibold">
          Role:
        </label>
        <select
          id="role"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          value={formData.role}
          onChange={handleRoleChange}
          required
        >
          <option value="USER">TA</option>
          <option value="INS">Instructor</option>
          <option value="DS">Department Staff</option>
          <option value="TACM">Committee Member</option>
        </select>
      </div>

      {selectedRole !== "USER" && (
        <div className="mb-4">
          <label htmlFor="department" className="block text-gray-700 font-semibold">
            Department:
          </label>
          <select
            id="department"
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            required
          >
            <option value="">Select Department</option>
            {departmentOptions.map((dept) => (
              <option key={dept._id} value={dept.departmentId}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Create
      </button>
      <button
        onClick={onCancel}
        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ml-3"
      >
        Cancel
      </button>
    </form>


  );
};

export default UserForm;
