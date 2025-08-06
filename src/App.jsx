import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Quizapp from './day5/Quizapp';
import Qppage from './day5/Qppage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Quizapp />} />
        <Route path="/category/:id" element={<Qppage />} />
      </Routes>
    </Router>
  );
}

export default App;
