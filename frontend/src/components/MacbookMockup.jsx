import { ImageWithFallback } from "./figma/ImageWithFallback";

export function MacBookMockup({ screenContent, screenImage, screenVideo }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* MacBook Container */}
      <div className="relative">
        {/* Screen */}
        <div className="bg-gray-800 rounded-t-2xl p-3 shadow-2xl">
          {/* Bezel */}
          <div className="bg-black rounded-lg p-2 relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>

            {/* Screen Content */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-md aspect-[16/10] overflow-hidden relative">
              {screenVideo ? (
                <video
                  src={screenVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : screenImage ? (
                <ImageWithFallback
                  src={screenImage}
                  alt="MacBook screen"
                  className="w-full h-full object-cover"
                />
              ) : screenContent ? (
                <div className="w-full h-full">{screenContent}</div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg
                        className="w-10 h-10"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">MacBook Pro</h3>
                    <p className="text-white/80">16-inch Display</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Camera Indicator */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full z-20">
            <div className="absolute inset-0.5 bg-gray-900 rounded-full"></div>
          </div>
        </div>

        {/* Base */}
        <div className="relative h-4 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-xl shadow-lg">
          {/* Keyboard deck shadow */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-b from-black/20 to-transparent"></div>
        </div>

        {/* Bottom plate */}
        <div className="h-2 bg-gradient-to-b from-gray-400 to-gray-300 -mt-0.5 mx-auto w-[98%] rounded-b-lg shadow-xl"></div>

        {/* Shadow */}
        <div className="absolute -bottom-4 inset-x-0 h-4 bg-gradient-to-b from-black/30 to-transparent blur-xl"></div>
      </div>
    </div>
  );
}
