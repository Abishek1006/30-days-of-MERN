import axios from 'axios';
import React, { useState } from 'react'

export default function Qppage() {
    const [questions,SetQuestions] = useState([]);

    useEffect(() => {
      const fetchquestion = async() =>{
        try {
            const res = await axios.get(`http://localhost:8081/api/questions/{id}`);
            SetQuestions(res.data)
        } catch (error) {
            console.error(error.error);
        }
      }
    }, [])
    
  return (
    <div>
        <h1>Qp page</h1>

        <div>

            questions.map((q) => <div id='q.id'> 
                <p >q.question</p>
                <p onClick={checkanswer(q.id , q.optiona)}>q.optiona</p>
                <p onClick={checkanswer(q.id , q.optionb)}>q.optionb</p>
                <p onClick={checkanswer(q.id , q.optionc)}>q.optionc</p>
                </div>


})

        </div>
    </div>
  )
}
