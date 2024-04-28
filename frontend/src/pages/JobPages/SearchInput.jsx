import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchInput = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative mb-4">
      <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search by title, course, instructor, or department"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 pl-10 w-full"
        autoFocus
      />
    </div>
  );
};

export default SearchInput;
