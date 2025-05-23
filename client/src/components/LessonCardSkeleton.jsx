import React from 'react';

export default function LessonCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full border border-gray-100 animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          
          {/* Progress and Time Skeleton */}
          <div className="mt-3 space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>

          {/* Description Accordion Skeleton */}
          <div className="mt-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="mt-2 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
          </div>

          {/* View Lesson Link Skeleton */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 