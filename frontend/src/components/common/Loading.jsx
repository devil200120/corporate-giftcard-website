import React from "react";
import { clsx } from "clsx";

const Loading = ({
  size = "md",
  text = "Loading...",
  fullScreen = false,
  className = "",
  variant = "modern", // 'modern', 'dots', 'pulse', 'bars'
}) => {
  const sizeClasses = {
    sm: { spinner: "w-6 h-6", dots: "w-1.5 h-1.5", bars: "h-4" },
    md: { spinner: "w-8 h-8", dots: "w-2 h-2", bars: "h-6" },
    lg: { spinner: "w-12 h-12", dots: "w-3 h-3", bars: "h-8" },
    xl: { spinner: "w-16 h-16", dots: "w-4 h-4", bars: "h-10" },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  // Modern Spinner Component
  const ModernSpinner = () => (
    <div className={clsx("relative", currentSize.spinner)}>
      <div className="absolute inset-0 rounded-full border-3 border-gray-200"></div>
      <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-gradient-to-r border-t-orange-500 animate-spin"></div>
      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 opacity-20 animate-pulse"></div>
    </div>
  );

  // Dots Loader Component
  const DotsLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={clsx(
            currentSize.dots,
            "bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full animate-bounce"
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        ></div>
      ))}
    </div>
  );

  // Pulse Loader Component
  const PulseLoader = () => (
    <div className={clsx("relative", currentSize.spinner)}>
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full animate-ping opacity-75"></div>
      <div className="absolute inset-2 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-full animate-pulse"></div>
    </div>
  );

  // Bars Loader Component
  const BarsLoader = () => (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={clsx(
            "w-1 bg-gradient-to-t from-orange-500 to-yellow-500 rounded-t animate-pulse",
            currentSize.bars
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "0.8s",
          }}
        ></div>
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return <DotsLoader />;
      case "pulse":
        return <PulseLoader />;
      case "bars":
        return <BarsLoader />;
      case "modern":
      default:
        return <ModernSpinner />;
    }
  };

  const loadingContent = (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      {renderLoader()}
      {text && (
        <div className="text-center">
          <p className="text-sm text-gray-600 font-medium mb-1">{text}</p>
          <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 min-w-[200px]">
          {loadingContent}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      {loadingContent}
    </div>
  );
};

// Additional loading components for specific use cases
export const PageLoader = ({ text = "Loading page..." }) => (
  <Loading fullScreen={true} variant="modern" size="lg" text={text} />
);

export const InlineLoader = ({ size = "sm", text = "" }) => (
  <div className="inline-flex items-center gap-2">
    <Loading size={size} variant="dots" text="" className="min-h-0" />
    {text && <span className="text-sm text-gray-600">{text}</span>}
  </div>
);

export const ButtonLoader = ({ size = "sm" }) => (
  <Loading size={size} variant="modern" text="" className="min-h-0 p-0" />
);

export default Loading;
