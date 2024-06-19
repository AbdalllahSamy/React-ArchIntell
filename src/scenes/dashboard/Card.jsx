import React from 'react'
import { CiShare1 } from "react-icons/ci";
import { FaUserFriends } from "react-icons/fa";

export const Card = ({ project }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 m-4 w-64">
            <div className="h-40 bg-gray-200 rounded-t-lg overflow-hidden">
                <img src={"https://th.bing.com/th/id/OIP.EACohm-7YxoDgDN8gD4lTgHaEU?w=311&h=181&c=7&r=0&o=5&pid=1.7"} alt={project.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
                <h2 className="font-bold text-l text-black">{project.title}</h2>
                <p className="text-black">{project.timeAgo}</p>
            </div>
            <div className="flex justify-end mt-4">
                <button className="text-blue-500 text-xl mr-2 hover:text-blue-700">
                    <CiShare1 />
                </button>
                <button className="text-blue-500 text-xl hover:text-blue-700">
                    <FaUserFriends />
                </button>
            </div>
        </div>
    )
}
