import React, { useState, useEffect, useRef } from 'react';

export default function Loader() {
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(100);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const sendMessage = () => {
    if (!message.trim()) return;

    setHidden(false);
    setLoading(true);
    setProgress(100);

    // Animate progress bar
    let timeElapsed = 0;
    const duration = 4000;
    const interval = 100;

    intervalRef.current = setInterval(() => {
      timeElapsed += interval;
      const newProgress = 100 - (timeElapsed / duration) * 100;
      setProgress(Math.max(newProgress, 0));
    }, interval);

    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      clearInterval(intervalRef.current);
      console.log("Message sent:", message);
       setMessage("")
    }, duration);
  };

  const cancelSendRequest = () => {
    setLoading(false);
    setHidden(true);
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
    setProgress(0);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h3 className="text-lg font-semibold">Request Delay</h3>

      <label className="block mb-1 text-sm font-medium text-gray-700">Enter a message</label>
      <input
        type="text"
        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        placeholder="Type your message..."
      />
      <button
        onClick={sendMessage}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Send
      </button>

      {loading && !hidden && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-lg border">
          <p className="font-medium text-gray-700 mb-2">Sending message...</p>

          <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-full bg-violet-600z transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 flex justify-end space-x-2">
            <button
              onClick={cancelSendRequest}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => setHidden(true)}
              className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
            >
              Hide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
