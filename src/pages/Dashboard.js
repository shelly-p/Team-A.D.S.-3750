import { useState, useEffect, useRef, useContext } from "react";
import { db, doc, getDoc, getDocs, auth, setDoc, addDoc, onSnapshot, query, where, playerCollectionRef } from "../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { GameContext } from "../contexts/GameContext";

const Dashboard = () => {
  const { currentUser, username, currentUserEmail } = useContext(AuthContext);
  const { gameInfo, getPlayerDocID, message } = useContext(GameContext);
  const accessCodeRef = useRef();
  const navigate = useNavigate();
  //const [newPlayerName, setNewPlayerName] = useState("");
  const [role, setRole] = useState("player");
  const [isCodeVerified, setIsCodeVerified] = useState(null);
  const [isCreatedByCurrentUser, setIsCreatedByCurrentUser] = useState(false);
  const [isSoloplayer, setIsSoloplayer] = useState(false);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [category, setCategory] = useState('');
  const [numOfQuestions, setNumOfQuestions] = useState(10);
  const [gameCode, setGameCode] = useState(null);
  const [gameType, setGameType] = useState("");


  const verifyCode = async (code) => {
    const docRef = doc(db, 'GameId', code);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setIsCodeVerified(true);
    } else {
      setIsCodeVerified(false);
      console.log("No such document!");
    }
  }

  const handleCodeSubmit = (event) => {
    event.preventDefault();
    verifyCode(accessCodeRef.current.value);
  }

  const joinMultiplayerGame = () => {
    handleAddPlayer(username, role);
    navigate("/WaitingRoom");
  }

  const handleAddPlayer = async () => {
    if (currentUser.email === gameInfo.createdBy) {
      setIsCreatedByCurrentUser(true);
      setRole("host");
    }
    // Check if player already exists
    const playerQuery = query(playerCollectionRef, where("gameID", "==", gameInfo.access), where("name", "==", username));
    const playerSnapshot = await getDocs(playerQuery);

    if (!playerSnapshot.empty) {
      const docId = playerSnapshot.docs[0].id;
      console.log("Existing player found with ID:", docId);
      getPlayerDocID(docId);
      return;
    }
    // Add new player
    await addDoc(playerCollectionRef, {
      name: username,
      gameID: gameInfo.access,
      points: 0,
      role: role
    });

  };

  const handleSoloplayer = () => {
    // Logic for solo play goes here
    setIsSoloplayer(true);
    setIsMultiplayer(false);

  };

  const handleMultiplayer = () => {
    setIsMultiplayer(true);
    setIsSoloplayer(false);
  };

  const handleCreateGame = async () => {
    console.log("category: ", category);
    console.log("number of questions: ", numOfQuestions);

    const access = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number for access code
    setGameCode(access);
    try {
      setDoc(doc(db, "GameId", JSON.stringify(access)), {
        access,
        category,
        createdBy: currentUser.email,
        numOfQuestions
      });
      console.log("Document written with ID: ", access);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleJoinGame = () => {
    // Logic for joining a game goes here
    navigate('/Game');
  };

  const handleNumOfQuestionsChange = (e) => {
    setNumOfQuestions(parseInt(e.target.value));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <>
      {currentUser ? (
        <>
          <div className="container-lg" >
            <div className=''>
              <div className="row align-items-start">
                <h1>Dashboard</h1>
                <div className="col">
                <h3>Solo-player</h3>
                
                  <div>
                    <label>
                      Category:
                      <select value={category} onChange={handleCategoryChange} >
                        <option value={""}>choose a category</option>
                        <option value={"history"}>history</option>
                        <option value={"arts & literature"}>arts & literature</option>
                        <option value={"entertainment"}>entertainment</option>
                        <option value={"geography"}>geography</option>
                        <option value={"mythology & folklore"}>mythology & folklore</option>
                        <option value={"religion"}>religion</option>
                        <option value={"science"}>science</option>
                        <option value={"sports"}>sports</option>
                      </select>
                    </label>
                    <br />
                    <label>
                      Number of questions:
                      <select value={numOfQuestions} onChange={handleNumOfQuestionsChange}>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                    </label>
                    <br />
                    <button onClick={handleCreateGame}>Create Game</button>
                    {gameCode && <p>Game code: {gameCode}</p>}
                    <button onClick={handleJoinGame}>Join Game</button>
                  </div>
                
            
                </div>
                <div className="col">
                <h3>Multiplayer</h3>
                  <div>
                    <label>
                      Category:
                      <select value={category} onChange={handleCategoryChange} >
                        <option value={"history"}>history</option>
                        <option value={"arts & literature"}>arts & literature</option>
                        <option value={"entertainment"}>entertainment</option>
                        <option value={"geography"}>geography</option>
                        <option value={"mythology & folklore"}>mythology & folklore</option>
                        <option value={"religion"}>religion</option>
                        <option value={"science"}>science</option>
                        <option value={"sports"}>sports</option>
                      </select>
                    </label>
                    <br />
                    <label>
                      Number of questions:
                      <select value={numOfQuestions} onChange={handleNumOfQuestionsChange}>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                    </label>
                    <br />
                    <button onClick={handleCreateGame}>Create Game</button>
                    {gameCode && <p>Game code: {gameCode}</p>}
                    <button onClick={handleJoinGame}>Join Game</button>
                  </div>
                
                </div>
                <div className="col">
                <h3>Join a multiplayer game</h3>
                <form onSubmit={handleCodeSubmit}>
                  <label>Access code:</label><br />
                  <input type="text" ref={accessCodeRef} /><br />
                  <button type="sumbit">Verify code</button>
                </form>

                {isCodeVerified ? (
                  <>
                    <p>Code is verified.</p>
                    <button onClick={joinMultiplayerGame}>Join</button>
                  </>
                ) : (
                  <>
                    <p>Invalid code.</p>
                  </>
                )}
                </div>
                
                
                
              </div>
            </div>
          </div >
        </>
      ) : (
        <>
          <div className="container-lg">
            <div className='row justify-content-center'>
              <div className="col-md-5 text-center">
                <p className="display-5 text-center">Must be logged in to play.</p>
                <button className="btn btn-secondary btn-lg" onClick={() => navigate("/Login")}>Go to Login</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Dashboard;