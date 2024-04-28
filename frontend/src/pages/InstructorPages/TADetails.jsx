import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import axiosInstance from "../../Helper/axiosInstance";
import toast from "react-hot-toast";
import WorkSummary from "./WorkSummary";

const TADetails = ({ selectedTA, onClose }) => {
  const [assignedTask, setAssignedTask] = useState("");
  const [rating, setRating] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [ratingError, setRatingError] = useState(false);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [previousWork, setPreviousWork] = useState([]);

  const [showPreviousSummary, setShowPreviousSummary] = useState(false);

  const assignWork = (e) => {
    e.preventDefault();
    const newTask = {
      task: assignedTask,
      rating: rating,
      remarks: remarks,
      assignedDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
    };
    console.log("new task is: ", newTask);
    // setAssignedTasks([...assignedTasks, newTask]);
    setAssignedTask("");
    setRating(0);
    setRemarks("");
  };

  // Function to filter out tasks that are not from today
  const filterTodayTasks = (tasks) => {
    const today = new Date().toLocaleDateString();
    return tasks.filter(
      (task) => new Date(task.assignedDate).toLocaleDateString() !== today
    );
  };

  const getSummary = async () => {
    try {
      let res = axiosInstance.post(`/evaluation/getSummary`, {
        taId: selectedTA.ta._id,
        courseId: selectedTA.course._id,
      });

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
      if ((await res).data.success) {
        console.log("summary fetched.", (await res).data);
        let today = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
        setPreviousWork(
          (await res).data.summary.filter((obj) => obj.date != today)
        );
        setAssignedTasks(
          (await res).data.summary.filter((obj) => obj.date == today)
        );

        //resetting the values
        setAssignedTask("");
        setRating(0);
        setRemarks("");
      }
    } catch (error) {
      console.error("Error Fetching data", error);
      toast.error("Error Fetching data");
    }
  };

  const handleRatingChange = (e) => {
    const r = parseInt(e.target.value, 10); // Parse input as integer
    if (r >= 0 && r <= 10) {
      setRatingError(false);
    } else {
      setRatingError(true);
    }
    setRating(r);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let formData = {
        task: assignedTask,
        rating,
        remark: remarks,
        date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
      };
      let res = axiosInstance.post(`/evaluation/addNewEvaluation`, {
        formData,
        taId: selectedTA.ta._id,
        courseId: selectedTA.course._id,
      });

      await toast.promise(res, {
        loading: "Adding...",
        success: (data) => {
          return data?.data?.message;
        },
        error: (data) => {
          return data?.response?.data.message;
        },
      });
      res = await res;
      if ((await res).data.success) {
        console.log("summary added.", (await res).data);
        getSummary();
      }
    } catch (error) {
      console.error("Error Fetching data", error);
      toast.error("Error Fetching data");
    }
  };

  useEffect(() => {
    console.log("selectedTA", selectedTA);
    getSummary();
  }, [selectedTA]);

  return (
    <div className="p-4 overflow-y-auto max-h-full scrollBar  rounded-lg shadow-inner">
      <div className="flex justify-end items-center mb-0 -mt-2 sticky top-0">
        <button
          onClick={onClose}
          className="border p-1 rounded-md hover:bg-red-600 hover:text-white"
        >
          <AiOutlineClose />
        </button>
      </div>
      <h2 className="mb-3 text-2xl font-semibold">TA Details</h2>

      <div className="max-h-72 overflow-auto scrollBar">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="font-semibold w-2/5">Name:</td>
              <td className="w-3/5">{selectedTA.ta.fullName}</td>
            </tr>
            <tr>
              <td className="font-semibold w-2/5">Course ID:</td>
              <td className="w-3/5">{selectedTA.course.courseId}</td>
            </tr>
            <tr>
              <td className="font-semibold w-2/5">Course Name:</td>
              <td className="w-3/5">{selectedTA.course.name}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="font-semibold text-2xl mt-6 mb-3">
          Add Today's Work Summary
        </h3>
        <form onSubmit={assignWork}>
          <div className="mb-3 flex justify-start space-x-8">
            <label htmlFor="work" className="font-semibold">
              Today's Work<span className="text-red-500">*</span>:
            </label>
            <input
              type="text"
              id="work"
              value={assignedTask}
              onChange={(e) => setAssignedTask(e.target.value)}
              placeholder="Enter task..."
              className="w-1/2 px-2 py-1 border rounded-md border-gray-700"
              required
            />
          </div>

          <div className="mb-3 flex justify-start space-x-20">
            <label htmlFor="rating" className="font-semibold">
              Rating<span className="text-red-500">*</span>:
            </label>
            <input
              type="number"
              id="rating"
              value={rating}
              onChange={handleRatingChange}
              placeholder="Enter rating..."
              className="w-1/2 px-2 py-1 border rounded-md border-gray-700"
              min="0"
              max="10"
              required
            />
          </div>
          {ratingError && (
            <p className="text-xs text-red-500  ml-36 mb-3 -mt-2">
              Rating must be between 0 to 10 only
            </p>
          )}
          <div className="mb-3 flex justify-start space-x-16">
            <label htmlFor="remarks" className="font-semibold">
              Remarks<span className="text-red-500">*</span>:
            </label>
            <textarea
              id="remark"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks..."
              className="w-1/2 px-2 py-1 border rounded-md border-gray-700"
            ></textarea>
          </div>

          <div className="mb-3 flex justify-center">
            <button
              type="submit"
              className="ml-3 px-4 py-1 rounded-md bg-blue-600 text-white 
      hover:bg-blue-700 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={ratingError || assignedTask.length == 0}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/**todays work summary component */}
      <WorkSummary heading="Today's Work Summary" tasks={assignedTasks} />
      <div className="mt-6">
        <button
          onClick={() => setShowPreviousSummary(!showPreviousSummary)}
          className="px-4 py-2 bg-gray-300 rounded-md text-gray-800 hover:bg-gray-400 focus:outline-none"
        >
          {showPreviousSummary ? "Hide" : "Show"} Previous Work Summary
        </button>
      </div>

      {showPreviousSummary && (
        <WorkSummary
          heading="Previous Work Summary"
          tasks={filterTodayTasks(previousWork)}
        />
      )}
    </div>
  );
};

export default TADetails;
