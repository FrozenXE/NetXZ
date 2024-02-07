import React from 'react';
import { multiFormatDateString } from "@/lib/utils";
import { CommentData } from '@/lib/appwrite/api';

interface CommentRenderProps {
  latestComment: CommentData;
}

const RenderOneComment: React.FC<CommentRenderProps> = ({ latestComment }) => {
  return (
    <div className="relative grid grid-cols-1 gap-4 border border-none rounded-lg bg-transparent shadow-lg w-full pt-10 pb-4">
      <div className="relative flex gap-4">
        <img src={latestComment.userImage} className="w-post_details-card flex flex-col md:flex-row items-stretch md:items-start8 h-8 lg:w-12 lg:h-12 rounded-full" />
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between">
            <p className="relative text-xl text-white whitespace-nowrap truncate overflow-hidden">{latestComment.userName}</p>
          </div>
          <p className="text-white text-sm">{multiFormatDateString(latestComment.createdAt)} </p>
        </div>
      </div>
      <p className="-mt-4 text-white text-l pt-3 pl-1">{latestComment.commentText}</p>
    </div>
  );
}

export default RenderOneComment;
