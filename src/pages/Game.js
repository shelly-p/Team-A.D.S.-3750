import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, collection, db, doc, getDocs, where, questionsCollectionRef, query, updateDoc, onAuthStateChanged, onSnapshot } from "../firebase";


function Timer({ onTimerEnd }) {
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      onTimerEnd();
      setSeconds(10);
    }
  }, [seconds, onTimerEnd]);

  return (
    <div>
      <p>Timer: {seconds}</p>
    </div>
  );
}



const Game = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [questionData, setQuestionData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [answerOptions, setAnswerOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentGameInfo, setCurrentGameInfo] = useState(JSON.parse(sessionStorage.getItem("gameInfo")));
  const [players, setPlayers] = useState([]);



  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticatedUser(user);

      } else {
        setAuthenticatedUser(null);
        setCurrentGameInfo(null);
      }
    });
    return unsubscribe;
  }, []);


  useEffect(() => {
    const getQuestions = async () => {
      const questionCol = query(questionsCollectionRef, where("category", "==", "geography"));
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
    if (currentGameInfo) {
      const q = query(collection(db, "players"), where("gameID", "==", currentGameInfo.access));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedPlayers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlayers(updatedPlayers);

      });
      return unsubscribe;
    }
  }, [db, currentGameInfo]);

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
      addPointsToCollection(totalPoints + points);
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

  const addPointsToCollection = async (totalPoints) => {
    const docId = sessionStorage.getItem("docId");
    console.log("docId: ", docId);
    const playerRef = doc(db, "players", docId);
    await updateDoc(playerRef, {
      points: totalPoints
    });
  }

  // show the answer poll 


  return (
    <div className="container text-center text-white">
      <div className="row">
        
        <div className="col-6">
          <div className="">
            <div className='row justify-content-center'>
              <div className=" text-center">
                {authenticatedUser ? (
                  <>
                    <h1>Trivia Game</h1>
                    {!isGameOver && <Timer onTimerEnd={handleNextQuestion} />}
                    <div className="login-card-container">
                      <div className="card-header">
                        Question {currentQuestionIndex + 1} of {questionData.length}
                      </div>

                      <div className="login-card w-100 h-100">
                        <p>Difficulty: {currentQuestion.difficulty}</p>
                        <p>Total Points: {totalPoints}</p>
                        <p className="">{currentQuestion.question}</p>
                      </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                      {answerOptions.map((option) => (
                        <div className="d-grid gap-3" key={option}>
                          <div className="p-2">
                            <div className="card">
                              <button
                                className="btn btn-outline-primary btn-block"
                                type="button"
                                value={option}
                                onClick={handleAnswer}
                                disabled={selectedAnswer !== ''}
                              >
                                {option}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </form>
                    <button
                      className="btn btn-dark"
                      onClick={handleNextQuestion}
                    >
                      Next Question
                    </button>
                    {isCorrect && <p>Correct!</p>}
                    {!isCorrect && selectedAnswer !== '' && <p>Incorrect!</p>}
                    {isGameOver && <p>Game Over!</p>}
                  </>
                ) : (
                  <>
                    <p className="display-5 text-center">Must be logged in to play.</p>
                    <button className="btn btn-secondary btn-lg" onClick={() => navigate("/Login")}>Go to Login</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <h3>Players</h3>
          <table className="table">
            <thead>
              <tr className="table-light">
                <th scope="col">Name</th>
                <th scope="col">Points</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr className="table-light" key={player.id}>
                  <td>{player.name}</td>
                  <td>{player.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>


  );
};

export default Game;