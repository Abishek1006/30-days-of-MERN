import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Qppage() {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // stores selected option per question
  const { id } = useParams(); // get category ID from URL

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/categories/${id}/questions`);
        setQuestions(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchQuestions();
  }, [id]);

  const checkAnswer = (questionId, selectedOptionId) => {
    // Prevent changing answer once selected
    if (selectedAnswers[questionId]) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOptionId,
    }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center m-4">Questions</h1>

      {questions.map((q) => (
        <div key={q.id} className="p-5 m-5 border bg-gray-100 rounded">
          <p className="font-semibold">{q.questionText}</p>

          {q.options.map((option) => {
            const isSelected = selectedAnswers[q.id] === option.id;
            const wasAnswered = q.id in selectedAnswers;
            const isCorrect = option.correct;

            let bgColor = 'bg-white';
            if (wasAnswered) {
              if (isSelected && isCorrect) {
                bgColor = 'bg-green-300';
              } else if (isSelected && !isCorrect) {
                bgColor = 'bg-red-300';
              } else if (!isSelected && isCorrect) {
                bgColor = 'bg-green-100'; // Show correct answer lightly
              } else {
                bgColor = 'bg-gray-100';
              }
            }

            return (
              <p
                key={option.id}
                onClick={() => checkAnswer(q.id, option.id)}
                className={`cursor-pointer p-2 m-1 rounded ${bgColor} ${
                  wasAnswered ? 'pointer-events-none' : 'hover:bg-blue-100'
                }`}
              >
                {option.optionText}
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
}
