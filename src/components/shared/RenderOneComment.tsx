import React from 'react';
import { multiFormatDateString } from "@/lib/utils";
import { CommentData } from '@/lib/appwrite/api';

interface CommentRenderProps {
  latestComment: CommentData;
}

const RenderOneComment: React.FC<CommentRenderProps> = ({ latestComment }) => {
  return (
    <div className=''>

    <div className="relative grid grid-cols-1 gap-4 border border-none rounded-lg bg-transparent shadow-lg w-full pt-10 pb-4">
      <div className="relative flex">
        <div className='w-1/6 m-auto pr-3'>
          <img src={latestComment.userImage} className="w-post_details-card m-auto flex flex-col md:flex-row items-stretch md:items-start8 h-12 lg:w-15 lg:h-15 rounded-full" />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-start items-center gap-1">
            <p className="relative text-sm text-white1 whitespace-nowrap truncate overflow-hidden">{latestComment.userName}</p>
          <p className="text-white text-xs">{multiFormatDateString(latestComment.createdAt)} </p>
          </div>
        <p className="-mt-4 text-white text-m pt-5 pl-1">{latestComment.commentText}</p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default RenderOneComment;
