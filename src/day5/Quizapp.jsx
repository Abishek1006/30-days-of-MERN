import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Quizapp() {
  const [catagories, setCatagories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCatagories = async () => {
      try {
        const res = await axios.get('http://localhost:8081/api/catagories');
        setCatagories(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCatagories(); 
  }, []);

  const redirectToParticularCatagory = (id) => {
    navigate(`/category/${id}`);
  };

  return (
    <div>
      <div className="m-10 bg-cyan-300 w-auto">
        <h1 className="font-bold p-3 text-2xl">Quiz App</h1>
      </div>

      <div>
        {catagories.map((quizcatagory) => (
          <div key={quizcatagory.id}>
            <p
              onClick={() => redirectToParticularCatagory(quizcatagory.id)}
              className="p-10 m-10 bg-white-500 text-cyan-600 cursor-pointer"
            >
              {quizcatagory.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
