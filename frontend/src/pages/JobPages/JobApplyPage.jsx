import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaTrashAlt } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
// import { FaGraduationCap } from "react-icons/fa";
import { RiBriefcaseLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { getUserData } from "../../Redux/authSlice";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../Helper/axiosInstance";

function JobApplyPage() {
  const [user, setUser] = useState({});
  const [isPrevServed, setIsPrevServed] = useState("No");

  const [course, setCourse] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [jobDetails, setJobDetails] = useState([]);
  const [gender, setGender] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const { jobId } = useParams();
  const dispatch = useDispatch();

  const getUser = async () => {
    let res = dispatch(getUserData());

    // await toast.promise(res, {
    //   loading: "Fetching profile...",
    //   success: (data) => {
    //     // console.log('data hai',data.payload);
    //     return data?.payload?.message;
    //   },
    //   error: (data) => {
    //     // console.log('data', data?.response?.data.message)
    //     return data?.response?.data.message;
    //   },
    // });

    res = await res;
    // console.log('data 2 hai', res.payload.user);
    setUser(res.payload.user);
  };

  useEffect(() => {
    getUser();
  }, [setUser]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file.size <= 500 * 1024) {
      // Max size 500KB
      setSelectedFile(file);
    } else {
      toast.error("File size exceeds 500KB limit");
      setSelectedFile(null);
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
  };

  const handleRadioChange = (event) => {
    if (event.target.value == "Yes") {
      setCourse("");
      setFromDate("");
      setToDate("");
      setJobDetails([]);
    }
    setIsPrevServed(event.target.value);
  };

  const handleAddDetails = () => {
    // Check if any of the fields are empty
    if (!course || !fromDate || !toDate) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Check if toDate is after fromDate
    if (toDate < fromDate) {
      toast.error("End date cannot be before start date.");
      return;
    }

    // If all validations pass, add the details
    const newDetail = {
      course: course,
      fromDate: fromDate,
      toDate: toDate,
    };

    setJobDetails([...jobDetails, newDetail]);

    // console.log("New Detail:", newDetail);
toast.success("Added successfully")
    // Optionally, you can clear the input fields after adding the detail
    setCourse("");
    setFromDate("");
    setToDate("");
  };

  const handleDeleteDetail = (indexToDelete) => {
    // Create a copy of the jobDetails array
    const updatedJobDetails = [...jobDetails];
    // Remove the detail at the specified index
    updatedJobDetails.splice(indexToDelete, 1);
    // Update the jobDetails state with the modified array
    setJobDetails(updatedJobDetails);
    toast.success("deleted successfully")
  };

  const handleSubmit = async () => {
    // console.log('all job details', jobDetails);

    // Create a FormData object to hold form data and the selected file
    const formData = new FormData();
    formData.append("file", selectedFile);

    // Append other form data fields as needed
    formData.append("appliedDate", new Date());
    formData.append("applicantName", user.fullName);
    formData.append("email", user.email);
    formData.append("phone", user.phone);
    formData.append("address", user.address);
    formData.append("gender", gender);
    formData.append("previousExperience", JSON.stringify(jobDetails));

    try {
      // Make a POST request to upload the file along with form data
      let res = axiosInstance.post(`/application/apply/${jobId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await toast.promise(res, {
        loading: "Applying...",
        success: (data) => {
          return data?.data?.message;
        },
        error: (data) => {
          return data?.response?.data.message;
        },
      });
      res = await res;

      console.log(res.data);
      if (res.data.success) {
        navigate("/applications");
      } else {
        console.log("Error applying");
      }

      // Handle success or error as needed
    } catch (error) {
      // Handle error
      console.error("Error uploading file:", error);
      toast.error("Error submitting application.");
    }
  };

  return (
    <div
      className="items-center sm:p-1 h-full  lg:min-h-screen bg-slate-50 "
      style={{ minHeight: "100vh" }}
    >
      <div className=" sm:m-1 lg:mx-16 lg:my-12 ">
        <div className="flex flex-col p-6  m-3 items-center text-wrap bg-white  shadow-md rounded-md">
          <h1 className="lg:text-3xl text-2xl font-semibold text-wrap">
            Welcome! {user.fullName}
          </h1>
          <span className="block mt-3 md:font-lg text-sm font-semibold text-right">
            Applying for {jobId}
          </span>
        </div>
        <div className="block  bg-white  shadow-md rounded-lg p-5 m-3  ">
          <div className="flex items-center">
            <CgProfile className="h-12 w-12 mr-4 text-orange-600" />
            <span className="text-2xl font-sans">Contact Details</span>
          </div>

          <table className="text-gray-800">
            <colgroup>
              <col style={{ width: "15%" }} />
              <col style={{ width: "60%" }} />
            </colgroup>
            <tbody>
              <tr>
                <td className="p-2 font-semibold align-top">Name</td>
                <td className="p-2 align-top">
                  <input
                    type="text"
                    placeholder="Enter your Name"
                    className="p-1 px-2 w-5/6 border border-red-500 rounded-md"
                    value={user.fullName}
                    name="fullName"
                    onChange={handleInputChange}
                  ></input>
                </td>
              </tr>
              <tr>
                <td className="p-2 font-semibold align-top">Email</td>
                <td className="p-2 align-top">
                  <input
                    type="text"
                    placeholder="Enter your email"
                    className="p-1 px-2 w-5/6 border border-red-500 rounded-md"
                    value={user.email}
                    onChange={handleInputChange}
                    name="email"
                  ></input>
                </td>
              </tr>
              <tr>
                <td className="p-2 font-semibold align-top">Contact</td>
                <td className="p-2 align-top">
                  <input
                    type="text"
                    placeholder="Enter your contact"
                    className="p-1 px-2 w-5/6 border border-red-500 rounded-md"
                    value={user.phone}
                    onChange={handleInputChange}
                    name="phone"
                  ></input>
                </td>
              </tr>

              <tr>
                <td className="p-2 font-semibold align-top">Gender</td>
                <td className="p-2 align-top ">
                  <div className="flex">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={gender === "Male"}
                        onChange={(e) => setGender(e.target.value)}
                        className="form-radio h-5 w-5 text-blue-500"
                      />
                      <span className="ml-2">Male</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={gender === "Female"}
                        onChange={(e) => setGender(e.target.value)}
                        className="form-radio h-5 w-5 text-blue-500"
                      />
                      <span className="ml-2">Female</span>
                    </label>
                  </div>
                </td>
              </tr>

              <tr>
                <td className="p-2 font-semibold align-top">
                  Permanent Address
                </td>
                <td className="p-2 align-top">
                  <textarea
                    type="text"
                    placeholder="Permanent Address"
                    className="p-1 px-2 w-5/6 border border-red-500 rounded-md"
                    value={user?.address}
                    onChange={handleInputChange}
                    name="address"
                    rows={3}
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="block bg-white  shadow-md rounded-lg p-5 m-3  ">
          <div className="flex items-center">
            <RiBriefcaseLine className="h-12 w-12 mr-4 text-orange-600" />
            <span className="text-2xl font-sans">Previous Experience</span>
          </div>
          <p className="p-2 font-semibold ">
            <span className="text-red-500 ">*</span>Previously Served as TA ?
          </p>
          <div className="p-2">
            <label className="inline-flex items-center ">
              <input
                type="radio"
                name="applyingForFirstJob"
                value="No"
                checked={isPrevServed === "No"}
                className="form-radio h-5 w-5 text-blue-500"
                onChange={handleRadioChange} // Add your onChange handler
              />
              <span className="ml-2">No</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                name="applyingForFirstJob"
                value="Yes"
                checked={isPrevServed === "Yes"}
                className="form-radio h-5 w-5 text-blue-500"
                onChange={handleRadioChange} // Add your onChange handler
              />
              <span className="ml-2">Yes</span>
            </label>
          </div>
          {isPrevServed === "Yes" && (
            <div className="p-2 lg:flex items-center ">
              {/***USE DROP DOWN HERE */}
              <input
                type="text"
                placeholder="Enter course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className=" p-2 px-2  border border-red-400 rounded-md text-sm"
              />

              <div className="lg:flex items-center ">
                <div className="lg:mx-6 lg:p-2">
                  <label className="font-semibold">From:</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="text-sm lg:border-2 border-red-500  lg:p-1 ml-2 rounded-md"
                  />
                </div>
                <div className="lg:mr-5 lg:p-2 mr-1">
                  <label className="font-semibold">To:</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="text-sm lg:border-2 border-red-500  lg:p-1 lg:ml-2 ml-7 rounded-md"
                  />
                </div>
              </div>

              <button
                onClick={handleAddDetails}
                className=" text-green-600  hover:bg-green-600 hover:text-white font-semibold px-6 rounded-md shadow-md lg:m-2 mt-3 p-1 transition duration-300 ease-in-out"
              >
                Add
              </button>
            </div>
          )}

          {/* Display added job details */}
          {jobDetails.length != 0 && (
            <div className="border rounded-md hover:shadow-md text-sm overflow-x-auto m-2">
              <table className="w-full rounded-md text-sm">
                <thead className="bg-gray-200">
                  <tr className="bg-gray-600 text-white">
                    <th className=" p-1 max-w-8 text-center">Course</th>
                    <th className=" p-1 max-w-4 text-center">From</th>
                    <th className=" p-1 max-w-4 text-center">To</th>
                    <th className=" p-1 max-w-1 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {jobDetails?.map((detail, index) => (
                    <tr key={index}>
                      <td className="text-sm  border p-1.5 truncate  max-w-8 text-center">
                        {detail.course}
                      </td>
                      <td className=" text-sm  border p-1.5 truncate  max-w-4 text-center">
                        {detail.fromDate}
                      </td>
                      <td className=" text-sm  border p-1.5 truncate  max-w-4 text-center">
                        {detail.toDate}
                      </td>
                      <td className="text-sm  border p-1.5 truncate  max-w-1 text-center">
                        <button
                          className="text-red-600 lg:m-1 lg:p-1 rounded hover:bg-red-600 hover:text-white transition duration-300 ease-in-out"
                          onClick={() => handleDeleteDetail(index)}
                        >
                          {" "}
                          <FaTrashAlt size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="block   p-5 m-3 bg-white  shadow-md rounded-lg ">
          <div className="flex items-center">
            <FaFilePdf className="h-12 w-12 mr-4 text-orange-600" />
            <span className="text-2xl font-sans">Resume</span>
          </div>
          <p className="p-2 font-semibold ">
            <span className="text-red-500 font-semibold">*</span>Upload your
            resume
          </p>
          <div className="p-2 lg:text-md text-sm">
            {!selectedFile ? (
              <div className="inline-block relative">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer font-semibold text-blue-600 py-2 px-4 rounded-md shadow-md hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out"
                >
                  Choose File
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  required
                  className="absolute hidden"
                />
              </div>
            ) : (
              <div className="border border-red-500 flex  text-sm rounded-md lg:justify-between lg:w-1/2 bg-slate-100 max-w-1/3 ">
                <p className="p-2 inline-flex">{selectedFile.name}</p>
                <button
                  onClick={handleDelete}
                  className="hover:bg-gray-200 hover:text-red-500 rounded-full p-2 px-3"
                >
                  <RxCross2 />
                </button>
              </div>
            )}
          </div>
        </div>
        <button
          className=" bg-white  text-red-500 hover:bg-red-600 hover:text-white font-semibold py-2 px-8 rounded-md shadow-md m-3 transition duration-300 ease-in-out"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default JobApplyPage;


// import React, { useEffect, useState } from "react";
// import { CgProfile } from "react-icons/cg";
// import { FaTrashAlt } from "react-icons/fa";
// import { FaFilePdf } from "react-icons/fa";
// import { RxCross2 } from "react-icons/rx";
// // import { FaGraduationCap } from "react-icons/fa";
// import { RiBriefcaseLine } from "react-icons/ri";
// import { useDispatch } from "react-redux";
// import { getUserData } from "../../Redux/authSlice";
// import toast from "react-hot-toast";
// import { useNavigate, useParams } from "react-router-dom";
// import axiosInstance from "../../Helper/axiosInstance";

// function JobApplyPage() {
//   const [user, setUser] = useState({});
//   const [isPrevServed, setIsPrevServed] = useState("No");

//   const [course, setCourse] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [jobDetails, setJobDetails] = useState([]);
//   const [gender, setGender] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const navigate = useNavigate();
//   const { jobId } = useParams();
//   const dispatch = useDispatch();

//   const getUser = async () => {
//     let res = dispatch(getUserData());

//     await toast.promise(res, {
//       loading: "Fetching profile...",
//       success: (data) => {
//         // console.log('data hai',data.payload);
//         return data?.payload?.message;
//       },
//       error: (data) => {
//         // console.log('data', data?.response?.data.message)
//         return data?.response?.data.message;
//       },
//     });

//     res = await res;
//     // console.log('data 2 hai', res.payload.user);
//     setUser(res.payload.user);
//   };

//   useEffect(() => {
//     getUser();
//   }, [setUser]);

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;

//     setUser((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file.size <= 500 * 1024) {
//       // Max size 500KB
//       setSelectedFile(file);
//     } else {
//       toast.error("File size exceeds 500KB limit");
//       setSelectedFile(null);
//     }
//   };

//   const handleDelete = () => {
//     setSelectedFile(null);
//   };

//   const handleRadioChange = (event) => {
//     if (event.target.value == "Yes") {
//       setCourse("");
//       setFromDate("");
//       setToDate("");
//       setJobDetails([]);
//     }
//     setIsPrevServed(event.target.value);
//   };

//   const handleAddDetails = () => {
//     // Check if any of the fields are empty
//     if (!course || !fromDate || !toDate) {
//       toast.error("Please fill in all fields.");
//       return;
//     }

//     // Check if toDate is after fromDate
//     if (toDate < fromDate) {
//       toast.error("End date cannot be before start date.");
//       return;
//     }

//     // If all validations pass, add the details
//     const newDetail = {
//       course: course,
//       fromDate: fromDate,
//       toDate: toDate,
//     };

//     setJobDetails([...jobDetails, newDetail]);

//     // console.log("New Detail:", newDetail);

//     // Optionally, you can clear the input fields after adding the detail
//     setCourse("");
//     setFromDate("");
//     setToDate("");
//   };

//   const handleDeleteDetail = (indexToDelete) => {
//     // Create a copy of the jobDetails array
//     const updatedJobDetails = [...jobDetails];
//     // Remove the detail at the specified index
//     updatedJobDetails.splice(indexToDelete, 1);
//     // Update the jobDetails state with the modified array
//     setJobDetails(updatedJobDetails);
//   };

//   const handleSubmit = async () => {
//     // console.log('all job details', jobDetails);

//     // Create a FormData object to hold form data and the selected file
//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     // Append other form data fields as needed
//     formData.append("appliedDate", new Date());
//     formData.append("applicantName", user.fullName);
//     formData.append("email", user.email);
//     formData.append("phone", user.phone);
//     formData.append("address", user.address);
//     formData.append("gender", gender);
//     formData.append("previousExperience", JSON.stringify(jobDetails));

//     try {
//       // Make a POST request to upload the file along with form data
//       let res = axiosInstance.post(`/application/apply/${jobId}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       await toast.promise(res, {
//         loading: "Applying...",
//         success: (data) => {
//           return data?.data?.message;
//         },
//         error: (data) => {
//           return data?.response?.data.message;
//         },
//       });
//       res = await res;

//       console.log(res.data);
//       if (res.data.success) {
//         navigate("/applications");
//       } else {
//         console.log("Error applying");
//       }

//       // Handle success or error as needed
//     } catch (error) {
//       // Handle error
//       console.error("Error uploading file:", error);
//       toast.error("Error submitting application.");
//     }
//   };

//   return (
//     <div
//       className="items-center sm:p-1 h-full  lg:min-h-screen "
//       style={{ minHeight: "85vh" }}
//     >
//       <div className=" sm:m-1 lg:mx-16 lg:my-12 ">
//         <div className="flex flex-col p-4 border border-pink-400 rounded-md m-3 items-center text-wrap">
//           <h1 className="lg:text-3xl text-2xl font-semibold text-wrap">
//             Welcome! {user.fullName}
//           </h1>
//           <span className="block mt-6 font-lg font-semibold">{jobId}</span>
//         </div>
//         <div className="block border border-red-400 rounded-md p-5 m-3  ">
//           <div className="flex items-center">
//             <CgProfile className="h-12 w-12 mr-4 text-orange-600" />
//             <span className="text-2xl font-sans">Contact Details</span>
//           </div>

//           <table className="text-gray-800">
//             <colgroup>
//               <col style={{ width: "15%" }} />
//               <col style={{ width: "60%" }} />
//             </colgroup>
//             <tbody >
//               <tr>
//                 <td className="p-2 font-semibold align-top">Name</td>
//                 <td className="p-2 align-top">
//                   <input
//                     type="text"
//                     placeholder="Enter your Name"
//                     className="p-1 px-2 w-5/6 border border-red-500 rounded-md"
//                     value={user.fullName}
//                     name="fullName"
//                     onChange={handleInputChange}
//                   ></input>
//                 </td>
//               </tr>
//               <tr>
//                 <td className="p-2 font-semibold align-top">Email</td>
//                 <td className="p-2 align-top">
//                   <input
//                     type="text"
//                     placeholder="Enter your email"
//                     className="p-1 px-2 w-5/6 border border-red-500 rounded-md"
//                     value={user.email}
//                     onChange={handleInputChange}
//                     name="email"
//                   ></input>
//                 </td>
//               </tr>
//               <tr>
//                 <td className="p-2 font-semibold align-top">Contact</td>
//                 <td className="p-2 align-top">
//                   <input
//                     type="text"
//                     placeholder="Enter your contact"
//                     className="p-1 px-2 w-5/6 border border-red-500 rounded-md"
//                     value={user.phone}
//                     onChange={handleInputChange}
//                     name="phone"
//                   ></input>
//                 </td>
//               </tr>

//               <tr>
//                 <td className="p-2 font-semibold align-top">Gender</td>
//                 <td className="p-2 align-top ">
//                   <div className="flex">
//                     <label className="inline-flex items-center">
//                       <input
//                         type="radio"
//                         name="gender"
//                         value="Male"
//                         checked={gender === "Male"}
//                         onChange={(e) => setGender(e.target.value)}
//                         className="form-radio h-5 w-5 text-blue-500"
//                       />
//                       <span className="ml-2">Male</span>
//                     </label>
//                     <label className="inline-flex items-center ml-6">
//                       <input
//                         type="radio"
//                         name="gender"
//                         value="Female"
//                         checked={gender === "Female"}
//                         onChange={(e) => setGender(e.target.value)}
//                         className="form-radio h-5 w-5 text-blue-500"
//                       />
//                       <span className="ml-2">Female</span>
//                     </label>
//                   </div>
//                 </td>
//               </tr>

//               <tr>
//                 <td className="p-2 font-semibold align-top">
//                   Permanent Address
//                 </td>
//                 <td className="p-2 align-top">
//                   <textarea
//                     type="text"
//                     placeholder="Permanent Address"
//                     className="p-1 px-2 w-5/6 border border-red-500 rounded-md"
//                     value={user?.address}
//                     onChange={handleInputChange}
//                     name="address"
//                     rows={3}
//                   ></textarea>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//         <div className="block border border-red-400 rounded-md p-5 m-3  ">
//           <div className="flex items-center">
//             <RiBriefcaseLine className="h-12 w-12 mr-4 text-orange-600" />
//             <span className="text-2xl font-sans">Previous Experience</span>
//           </div>
//           <p className="p-2 font-semibold ">
//             <span className="text-red-500 ">*</span>Previously Served as TA ?
//           </p>
//           <div className="p-2">
//             <label className="inline-flex items-center ">
//               <input
//                 type="radio"
//                 name="applyingForFirstJob"
//                 value="No"
//                 checked={isPrevServed === "No"}
//                 className="form-radio h-5 w-5 text-blue-500"
//                 onChange={handleRadioChange} // Add your onChange handler
//               />
//               <span className="ml-2">No</span>
//             </label>
//             <label className="inline-flex items-center ml-6">
//               <input
//                 type="radio"
//                 name="applyingForFirstJob"
//                 value="Yes"
//                 checked={isPrevServed === "Yes"}
//                 className="form-radio h-5 w-5 text-blue-500"
//                 onChange={handleRadioChange} // Add your onChange handler
//               />
//               <span className="ml-2">Yes</span>
//             </label>
//           </div>
//           {isPrevServed === "Yes" && (
//             <div className="p-2 lg:flex items-center ">
//               {/***USE DROP DOWN HERE */}
//               <input
//                 type="text"
//                 placeholder="Enter course"
//                 value={course}
//                 onChange={(e) => setCourse(e.target.value)}
//                 className=" p-2 px-2  border border-red-400 rounded-md text-sm"
//               />

//               <div className="lg:flex items-center ">
//                 <div className="lg:mx-6 lg:p-2">
//                   <label className="font-semibold">From:</label>
//                   <input
//                     type="date"
//                     value={fromDate}
//                     onChange={(e) => setFromDate(e.target.value)}
//                     className="text-sm lg:border-2 border-red-500  lg:p-1 ml-2 rounded-md"
//                   />
//                 </div>
//                 <div className="lg:mr-5 lg:p-2 mr-1">
//                   <label className="font-semibold">To:</label>
//                   <input
//                     type="date"
//                     value={toDate}
//                     onChange={(e) => setToDate(e.target.value)}
//                     className="text-sm lg:border-2 border-red-500  lg:p-1 lg:ml-2 ml-7 rounded-md"
//                   />
//                 </div>
//               </div>

//               <button
//                 onClick={handleAddDetails}
//                 className="border bg-red-500 text-white  hover:bg-red-600 hover:text-white font-semibold px-6 rounded-md lg:m-2 mt-3 p-1"
//               >
//                 Add
//               </button>
//             </div>
//           )}

//           {/* Display added job details */}
//           {jobDetails.length != 0 && (
//             <div className="border rounded-md hover:shadow-md text-sm overflow-x-auto m-2">
//               <table className="w-full rounded-md text-sm">
//                 <thead className="bg-gray-200">
//                   <tr>
//                     <th className=" p-1 max-w-8 text-center">Course</th>
//                     <th className=" p-1 max-w-4 text-center">From</th>
//                     <th className=" p-1 max-w-4 text-center">To</th>
//                     <th className=" p-1 max-w-1 text-center">Delete</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {jobDetails?.map((detail, index) => (
//                     <tr key={index}>
//                       <td className="text-sm  border p-1.5 truncate  max-w-8 text-center">
//                         {detail.course}
//                       </td>
//                       <td className=" text-sm  border p-1.5 truncate  max-w-4 text-center">
//                         {detail.fromDate}
//                       </td>
//                       <td className=" text-sm  border p-1.5 truncate  max-w-4 text-center">
//                         {detail.toDate}
//                       </td>
//                       <td className="text-sm  border p-1.5 truncate  max-w-1 text-center">
//                         <button
//                           className="text-red-600 lg:m-1 lg:p-1 rounded hover:bg-red-600 hover:text-white"
//                           onClick={() => handleDeleteDetail(index)}
//                         >
//                           {" "}
//                           <FaTrashAlt size={12} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         <div className="block border border-red-400 rounded-md p-5 m-3  ">
//           <div className="flex items-center">
//             <FaFilePdf className="h-12 w-12 mr-4 text-orange-600" />
//             <span className="text-2xl font-sans">Resume</span>
//           </div>
//           <p className="p-2 font-semibold ">
//             <span className="text-red-500 font-semibold">*</span>Upload your
//             resume
//           </p>
//           <div className="p-2 lg:text-md text-sm">
//             {!selectedFile ? (
//               <div className="inline-block">
//                 <input
//                   type="file"
//                   onChange={handleFileChange}
//                   accept=".pdf,.doc,.docx"
//                   required
//                 />
//               </div>
//             ) : (
//               <div className="border border-red-500 flex  text-sm rounded-md lg:justify-between lg:w-1/2 bg-slate-100 max-w-1/3 ">
//                 <p className="p-2 inline-flex">{selectedFile.name}</p>
//                 <button
//                   onClick={handleDelete}
//                   className="hover:bg-gray-200 hover:text-red-500 rounded-full p-2 px-3"
//                 >
//                   <RxCross2 />
//                 </button>
//               </div>
//             )}
//             {/*selectedFile && (
//               <button
//                 onClick={handleUpload}
//                 className=" border border-red-500 px-2 py-1 rounded-md  bg-red-500 text-white  hover:bg-red-600 hover:text-white font-semibold   mt-2"
//               >
//                 Upload
//               </button>
//             )*/}
//           </div>
//         </div>
//         <button
//           className="border border-red-500 bg-red-500  text-white hover:bg-red-600 hover:text-white font-semibold py-2 px-8 rounded-md m-3"
//           onClick={handleSubmit}
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// }

// export default JobApplyPage;