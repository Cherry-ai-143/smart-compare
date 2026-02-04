import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export type ProfileCardProps = {
  name: string;
  email: string;
  photoURL?: string;
  memberSince: string;
  totalComparisons: number;
  savedComparisons: number;
  favoriteCategory: string;
  recentlyViewedCount?: number;
  mostComparedCategory?: string;
};

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  photoURL,
  memberSince,
  totalComparisons,
  savedComparisons,
  favoriteCategory,
  recentlyViewedCount,
  mostComparedCategory,
}) => {
  const getInitial = () =>
    name && name.length > 0 ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase();

  return (
    <div
      className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center gap-4 border border-gray-100 dark:border-gray-800"
    >
      <Avatar className="h-20 w-20 mb-2 ring-2 ring-primary/30">
        {photoURL && photoURL.trim() !== "" ? (
          <AvatarImage src={photoURL} alt={name} />
        ) : null}
        <AvatarFallback className="bg-gradient-to-br from-primary via-accent to-secondary text-white font-bold text-3xl">
          {getInitial()}
        </AvatarFallback>
      </Avatar>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{email}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Member since {memberSince}</p>
      <div className="w-full flex flex-col gap-2 mt-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Total Comparisons:</span>
          <span className="text-gray-600 dark:text-gray-400">{totalComparisons}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Saved Comparisons:</span>
          <span className="text-gray-600 dark:text-gray-400">{savedComparisons}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Favorite Category:</span>
          <span className="text-gray-600 dark:text-gray-400">{favoriteCategory}</span>
        </div>
        {recentlyViewedCount !== undefined && (
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Recently Viewed:</span>
            <span className="text-gray-600 dark:text-gray-400">{recentlyViewedCount}</span>
          </div>
        )}
        {mostComparedCategory && (
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Most Compared Category:</span>
            <span className="text-gray-600 dark:text-gray-400">{mostComparedCategory}</span>
          </div>
        )}
      </div>
    </div>
  );
};
