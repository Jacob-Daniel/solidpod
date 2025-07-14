"use client";

const ShareButton = () => {
  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: "I just supported this petition!",
        text: "Join me in supporting this important cause",
        url: window.location.href,
      });
    } catch (err) {
      // Fallback to custom share buttons if native API isn't supported
      console.log("Native share not supported");
    }
  };

  return (
    <button
      onClick={handleNativeShare}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
    >
      Share via...
    </button>
  );
};

export default ShareButton;
