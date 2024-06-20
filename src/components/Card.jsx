import React from 'react';

import { download } from '../assets';
import { downloadImage } from './../utils';
import { FaDownload } from "react-icons/fa";

const Card = ({ post }) => (
  <div className="rounded-xl group relative shadow-card hover:shadow-cardhover card">
    <img
      className="w-full h-auto object-cover rounded-xl"
      src={post.image ? post.image : post.image2D}
      alt={post.description}
    />
    <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md">
      <p className="text-white text-sm overflow-y-auto prompt">{post.description}</p>

      <div className="mt-5 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold"></div>
          <p className="text-white text-sm">{post.title}</p>
        </div>
        <button type="button" onClick={() => downloadImage(post._id, post.image ? post.image : post.image2D)} className="!text-white">
          {/* <img src={download} alt="download" className="w-6 h-6 object-contain invert" /> */}
          <FaDownload className="w-6 h-6 !text-white" />
        </button>
      </div>
    </div>
  </div>
);

export default Card;
