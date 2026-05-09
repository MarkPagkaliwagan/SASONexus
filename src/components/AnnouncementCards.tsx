"use client";

import { useState } from "react";
import { FaExpand, FaTimes } from "react-icons/fa";

interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  image: string | null;
  isActive: boolean;
  createdAt: Date;
}

const categoryColors: Record<string, string> = {
  Enrollment: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Academics: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Activities: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Scholarship: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  General: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  Event: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  Advisory: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

function ImageModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/80 hover:text-white transition cursor-pointer">
          <FaTimes className="w-5 h-5" />
        </button>
        <img src={src} alt={alt} className="w-full h-auto max-h-[85vh] object-contain rounded-xl bg-white shadow-2xl" />
      </div>
    </div>
  );
}

export default function AnnouncementCards({ announcements }: { announcements: Announcement[] }) {
  const [viewImage, setViewImage] = useState<{ src: string; alt: string } | null>(null);

  if (announcements.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 dark:text-gray-500">No announcements at this time.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(a.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full w-fit ${categoryColors[a.category] || categoryColors.General}`}>
                  {a.category}
                </span>
              </div>

              {a.image ? (
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="sm:w-56 shrink-0 sm:self-stretch">
                    <button onClick={() => setViewImage({ src: a.image!, alt: a.title })} className="group relative w-full h-full cursor-pointer">
                      <div className="w-full h-48 sm:h-full min-h-[160px] bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center p-2 overflow-hidden">
                        <img src={a.image} alt={a.title} className="w-full h-full object-contain" />
                      </div>
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/5 rounded-lg transition-colors flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                          <FaExpand className="text-gray-600 text-sm" />
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">{a.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm">{a.content}</p>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">{a.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{a.content}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {viewImage && (
        <ImageModal src={viewImage.src} alt={viewImage.alt} onClose={() => setViewImage(null)} />
      )}
    </>
  );
}
