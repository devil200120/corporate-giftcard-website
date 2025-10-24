import React, { useState } from "react";
import {
  StarIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  FlagIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

const ReviewCard = ({ review, onHelpful, onReport, showActions = true }) => {
  const [isHelpfulClicked, setIsHelpfulClicked] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [showFullReview, setShowFullReview] = useState(false);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarSolidIcon
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const handleHelpful = () => {
    if (!isHelpfulClicked) {
      setIsHelpfulClicked(true);
      onHelpful && onHelpful(review.id);
    }
  };

  const handleReport = () => {
    if (!isReported) {
      setIsReported(true);
      onReport && onReport(review.id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const shouldTruncate = review.comment && review.comment.length > 300;
  const displayComment =
    shouldTruncate && !showFullReview
      ? `${review.comment.substring(0, 300)}...`
      : review.comment;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={review.user?.avatar || "/api/placeholder/40/40"}
            alt={
              `${review.user?.firstName} ${review.user?.lastName}` ||
              "Anonymous"
            }
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900 dark:text-white">
                {`${review.user?.firstName} ${review.user?.lastName}` ||
                  "Anonymous"}
              </span>
              {review.user?.verified && (
                <CheckCircleIcon
                  className="w-4 h-4 text-green-500"
                  title="Verified Purchase"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Review Badge */}
        {review.user?.verified && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Verified Purchase
          </span>
        )}
      </div>

      {/* Review Title */}
      {review.title && (
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          {review.title}
        </h4>
      )}

      {/* Review Content */}
      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {displayComment}
        </p>

        {shouldTruncate && (
          <button
            onClick={() => setShowFullReview(!showFullReview)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
          >
            {showFullReview ? "Show Less" : "Read More"}
          </button>
        )}
      </div>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => {
                // Open image modal/lightbox
                console.log("Open image:", image);
              }}
            />
          ))}
        </div>
      )}

      {/* Variant Info */}
      {(review.variant || review.size || review.color) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {review.variant && (
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded">
              Variant: {review.variant}
            </span>
          )}
          {review.size && (
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded">
              Size: {review.size}
            </span>
          )}
          {review.color && (
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded">
              Color: {review.color}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <button
              onClick={handleHelpful}
              disabled={isHelpfulClicked}
              className={`flex items-center gap-2 text-sm transition-colors ${
                isHelpfulClicked
                  ? "text-green-600 cursor-default"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              <HandThumbUpIcon className="w-4 h-4" />
              <span>
                Helpful {review.helpfulCount > 0 && `(${review.helpfulCount})`}
              </span>
              {isHelpfulClicked && <span className="text-xs">✓ Thanks!</span>}
            </button>
          </div>

          <button
            onClick={handleReport}
            disabled={isReported}
            className={`flex items-center gap-2 text-sm transition-colors ${
              isReported
                ? "text-red-600 cursor-default"
                : "text-gray-500 hover:text-red-600"
            }`}
          >
            <FlagIcon className="w-4 h-4" />
            <span>{isReported ? "Reported" : "Report"}</span>
          </button>
        </div>
      )}

      {/* Admin Response */}
      {review.adminResponse && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="font-medium text-blue-900 dark:text-blue-200">
              Admin Response
            </span>
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {formatDate(review.adminResponse.createdAt)}
            </span>
          </div>
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            {review.adminResponse.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
