import React, { useState ,useEffect} from 'react';
import axios from 'axios';

export default function MoodMain()
{
  const [newarea, setNewarea] = useState(false);
  const [content, setContent] = useState("");
  const [input, setInput] = useState("");

  const generateContent = async () => {
    try {
        setNewarea(true)
      // Example with dummy API
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
        title: input,
        body: 'dummy content',
      });

      // Simulate generated content
      setContent(`Generated content for: ${input}\n\nResponse ID: ${response.data.id}`);
       localStorage.setItem("lastPrompt", input);
        localStorage.setItem("lastResponse", content);
  localStorage.setItem("lastResponse", content);
    } catch (error) {
      setContent("Failed to generate content.");
      console.error(error);
    }
  };

  useEffect(() => {
  const lastInput = localStorage.getItem("lastPrompt");
  if (lastInput) {
    setInput(lastInput);
  }
}, []);

  const resetall = () => {
    localStorage.clear;
    setNewarea(false);
    setContent("");
    input("");

  }

  return (
    <div>
      <div>
        <h2 className='text-4xl self-center font-bold text-blue-500'>Content Generator</h2>
      </div>
      <div className='p-10 mx-auto bg-amber-300 justify-center'>
        <label className='text-center block font-medium'>Enter your context here</label>

        <textarea
          onChange={(e) => setInput(e.target.value)}
          className="w-full m-3 max-w-md border border-gray-400 rounded p-2 resize-none overflow-hidden"
          rows={1}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          placeholder="Type your message..."
        ></textarea>

        <button
          onClick={generateContent}
          className='border-2 p-2 mt-3 bg-fuchsia-700 text-white font-normal border-red-500'
        >
          Generate a dummy mail
        </button>
      </div>

      {newarea && (
        <div className='bg-zinc-400 p-5 justify-center m-5 mx-auto'>
          <h4 className='font-medium'>Your content is generated</h4>
          <p className='border-2 w-auto h-auto justify-stretch whitespace-pre-line'>{content}</p>
          <button className='border-1 bg-red-500 p-2 mt-2 ' onClick={resetall}>reset</button>
        </div>
      )}
    </div>
  );
}
