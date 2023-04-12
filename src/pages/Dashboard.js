import { useState, useEffect, useRef } from "react";
import { addGame, db, doc, getDoc, getDocs, auth, onAuthStateChanged, collection, addDoc, onSnapshot, query, where } from "../firebase";
import { useNavigate } from "react-router-dom";



const Dashboard = () => {
  const accessCodeRef = useRef();
  const gameInfo = useRef([]);
  const invalidCodeMsg = useRef();


  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [role, setRole] = useState("player");
  const [isCodeVerified, setIsCodeVerified] = useState(null);
  const [isCreatedByCurrentUser, setIsCreatedByCurrentUser] = useState(false);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [category, setCategory] = useState('');
  const [numOfQuestions, setNumOfQuestions] = useState(10);
  const [gameCode, setGameCode] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticatedUser(user);
        setNewPlayerName(sessionStorage.getItem("username"));
      } else {
        setAuthenticatedUser(null);
      }
    });
    return unsubscribe;
  }, [auth]);

  useEffect(() => {
    const fetchEmail = async () => {
      if (authenticatedUser) {
        try {
          const docRef = doc(db, "users", authenticatedUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setEmail(docSnap.data().email);
            //console.log(email);
          } else {
            setEmail(null);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchEmail();
  }, [authenticatedUser, db]);

  useEffect(() => {
    if (authenticatedUser && email === gameInfo.current.createdBy) {
      setIsCreatedByCurrentUser(true);
      setRole("host");
    }
  }, [authenticatedUser, email]);




  const getCode = async (e) => {
    e.preventDefault();
    const docRef = doc(db, 'GameId', accessCodeRef.current.value)
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
      gameInfo.current = docSnap.data();
      console.log(gameInfo.current);
      sessionStorage.setItem("gameInfo", JSON.stringify(gameInfo.current));
      handleAddPlayer();
      setIsCodeVerified(true);
      invalidCodeMsg.current = "Code valid.";
    } else {
      setIsCodeVerified(false);
      console.log("No such document!");
    }
  }


  const handleAddPlayer = async () => {
    // Check if player already exists
    const existingPlayerQuery = query(collection(db, "players"), where("gameID", "==", gameInfo.current.access), where("name", "==", newPlayerName));
    const existingPlayerSnapshot = await getDocs(existingPlayerQuery);

    if (!existingPlayerSnapshot.empty) {
      const docId = existingPlayerSnapshot.docs[0].id;
      console.log("player name: ", sessionStorage.getItem("username"))
      console.log("Existing player found with ID:", docId);
      sessionStorage.setItem("docId", docId);
      return;
    }

    // Add new player
    const playerRef = collection(db, "players");
    await addDoc(playerRef, {
      name: newPlayerName,
      gameID: gameInfo.current.access,
      points: 0,
      role: role
    });
  };

  const handleSoloplayer = () => {
    // Logic for solo play goes here
    navigate('/Game');
  };

  const handleMultiplayer = () => {
    setIsMultiplayer(true);
  };

  const handleCreateGame = async () => {
    // Call the addGame function to add a new game to Firebase
    const accessCode = await addGame(category, numOfQuestions, 'user@example.com');

    // Update the state to display the access code
    setGameCode(accessCode);
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
      {authenticatedUser ? (
        <>
          <div className="container-lg" >
            <div className='row justify-content-center'>
              <div className="col-md-5 text-center">
                <h1>Dashboard</h1>
                <button onClick={handleSoloplayer}>Solo-player</button>
                <button onClick={handleMultiplayer}>Multiplayer</button>
                {isMultiplayer && (
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
                )}
                <form onSubmit={getCode}>
                  <p>Join a multiplayer game</p>
                  <label>Access code:</label><br />
                  <input type="text" ref={accessCodeRef} /><br />
                  <button type="sumbit">Verify code</button>
                </form>

                {isCodeVerified ? (
                  <>
                    <p>Code is verified.</p>
                    <button onClick={() => navigate("/WaitingRoom")}>Join</button>
                  </>
                ) : (
                  <>
                    <p>Invalid code.</p>
                  </>
                )}
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