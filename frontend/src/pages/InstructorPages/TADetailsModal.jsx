import React from "react";
import TADetails from "./TADetails"; // Assuming the TADetails component is in a separate file

const TADetailsModal = ({ selectedTA, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 bg-cover flex justify-center">
      <div className="my-4 p-1 w-11/12 bg-white md:p-4 rounded-lg lg:w-4/5 max-h-full  relative">
        <TADetails selectedTA={selectedTA} onClose={onClose} />
      </div>
    </div>
  );
};

export default TADetailsModal;
