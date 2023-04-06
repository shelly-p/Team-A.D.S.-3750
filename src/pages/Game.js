import React, { useState, useEffect } from "react";
import { getDocs } from "firebase/firestore";
import { where, questionsCollectionRef, query } from "../firebase";

const Game = () => {
  const [questionData, setQuestionData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [answerOptions, setAnswerOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const getQuestions = async () => {
      const questionCol = query(questionsCollectionRef, where("category", "==", "history"));
      const snapshot = await getDocs(questionCol);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        question: doc.data().question,
        answer: doc.data().answer,
        difficulty: doc.data().difficulty,
      }));
      setQuestionData(data);
      setCurrentQuestion(randomQuestion(data));
    };

    getQuestions();
  }, []);

  useEffect(() => {
    if (currentQuestion.id) {
      setAnswerOptions(randomAnswerOptions(currentQuestion, questionData));
      setSelectedAnswer('');
      setIsCorrect(false);
    }
  }, [currentQuestion]);

  const randomQuestion = (questions) => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  };

  const randomAnswerOptions = (question, questions) => {
    const options = [question.answer];
    while (options.length < 4) {
      const randomQ = randomQuestion(questions);
      if (randomQ.answer !== question.answer && !options.includes(randomQ.answer)) {
        options.push(randomQ.answer);
      }
    }
    shuffleArray(options);
    return options;
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === questionData.length - 1) {
      setCurrentQuestion({});
      setIsGameOver(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentQuestion(questionData[currentQuestionIndex + 1]);
    }
  };

  const handleAnswer = (event) => {
    const userAnswer = event.target.value;
    setSelectedAnswer(userAnswer);
    setIsCorrect(userAnswer === currentQuestion.answer.toString());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsCorrect(selectedAnswer === currentQuestion.answer.toString());
  }

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const totalQuestions = questionData.length;
  const currentQuestionNumber = currentQuestionIndex + 1;

  return (
    <div className="container-lg">
    <div className='row justify-content-center'>
      <div className="col-md-5 text-center">
        <h1>Trivia Game</h1>
        <p>Question {currentQuestionIndex + 1} of {questionData.length}</p>
        <form onSubmit={handleSubmit}>
          <p>{currentQuestion.difficulty}</p>
          <p>{currentQuestion.question}</p>
          {answerOptions.map((option) => (
            <div key={option}>
              <label>
                <button
                  type="button"
                  value={option}
                  onClick={handleAnswer}
                  disabled={selectedAnswer !== ''}
                >
                  {option}
                </button>
              </label>
            </div>
          ))}
        </form>
        <button onClick={handleNextQuestion}>Next Question</button>
        {isCorrect && <p>Correct!</p>}
        {!isCorrect && selectedAnswer !== '' && <p>Incorrect. Try again.</p>}
        {isGameOver && <p>Game Over!</p>}
      </div>
    </div>
  </div>
  );
};

export default Game;
