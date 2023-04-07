import React, { useState, useEffect } from "react";
import { getDocs, where, questionsCollectionRef, query } from "../firebase";

const Game = () => {
  const [questionData, setQuestionData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [answerOptions, setAnswerOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    const getQuestions = async (isHost) => {
      const questionCol = query(questionsCollectionRef, where("category", "==", "history"));
      if (isHost) {
        // TODO: Add logic to get questions only for the host
      }
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
      const points = calculatePoints(currentQuestion.difficulty);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentQuestion(questionData[currentQuestionIndex + 1]);
      setIsCorrect(false);
      setSelectedAnswer('');

    }
  };

  const handleAnswer = (event) => {
    const userAnswer = event.target.value;
    const isAnswerCorrect = userAnswer === currentQuestion.answer.toString();
    setSelectedAnswer(userAnswer);
    setIsCorrect(isAnswerCorrect);
    const points = calculatePoints(currentQuestion.difficulty);
    if (isAnswerCorrect) {
      setTotalPoints(totalPoints + points);
    }
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

  const calculatePoints = (difficulty) => {
    switch (difficulty) {
      case 1:
        return 100;
      case 2:
        return 150;
      case 3:
        return 200;
      case 4:
        return 250;
      case 5:
        return 500;
      default:
        return 0;
    }
  };

  const handleAccessCodeChange = (event) => {
    setAccessCode(event.target.value);
  };

  const handleJoinGame = (event) => {
    event.preventDefault();
    // TODO: Check if the access code entered by the user is valid
    // TODO: Get the questions and other game data from the database
    // TODO: Set the state to start the game as a player
  };


  const handleStartGame = () => {
    setIsHost(true);
    const code = Math.floor(Math.random() * 9000) + 1000;
    setAccessCode(code);
    // TODO: Save the access code and questions to the database for other players to join
  };


  const totalQuestions = questionData.length;
  const currentQuestionNumber = currentQuestionIndex + 1;

  return (
    <>
      {!isHost && (
        <form onSubmit={handleJoinGame}>
          <label>
            Access Code:
            <input type="text" value={accessCode} onChange={handleAccessCodeChange} />
          </label>
          <button type="submit">Join Game</button>
        </form>
      )}

      {isHost && (
        <div>
          <p>Access Code: {accessCode}</p>
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      )}

      {isHost && isGameStarted && (
        <div className="container-lg">
          <div className='row justify-content-center'>
            <div className="col-md-5 text-center">
              <h1>Trivia Game</h1>
              <p>Question {currentQuestionIndex + 1} of {questionData.length}</p>
              <form onSubmit={handleSubmit}>
                <p>Difficulty: {currentQuestion.difficulty}</p>
                <p>Total Points: {totalPoints}</p>
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
      )}
    </>
  );
};

export default Game;