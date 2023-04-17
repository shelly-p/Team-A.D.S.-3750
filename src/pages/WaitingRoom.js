import { useState, useEffect } from "react";
import {
  auth,
  db,
  doc,
  getDoc,
  onAuthStateChanged,
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
  orderBy,
} from "../firebase";
import { useNavigate } from "react-router-dom";

const WaitingRoom = () => {
  const [email, setEmail] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [players, setPlayers] = useState([]);
  const [role, setRole] = useState("player");
  const [currentGameInfo, setCurrentGameInfo] = useState(
    JSON.parse(localStorage.getItem("gameInfo"))
  );
  const [isGameStarted, setIsGameStarted] = useState(false);
  const navigate = useNavigate();
  const gameRef = doc(db, "GameId", JSON.stringify(currentGameInfo.access));
  console.log(gameRef);

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
    const fetchEmail = async () => {
      if (authenticatedUser) {
        try {
          const docRef = doc(db, "users", authenticatedUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setEmail(docSnap.data().email);
            console.log(email);
          } else {
            setEmail(null);
          }

          const gameRef = doc(
            db,
            "GameId",
            JSON.stringify(currentGameInfo.access)
          );
          const gameSnap = await getDoc(gameRef);

          if (gameSnap.exists()) {
            setIsGameStarted(gameSnap.data().isStarted);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchEmail();
  }, [authenticatedUser, db, currentGameInfo]);

  useEffect(() => {
    if (currentGameInfo) {
      const q = query(
        collection(db, "players"),
        where("gameID", "==", currentGameInfo.access)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedPlayers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlayers(updatedPlayers);
        console.log(players.uid);

        const isCreatedByCurrentUser =
          authenticatedUser && email === currentGameInfo.createdBy;
        if (isCreatedByCurrentUser) {
          setRole("host");
        }
        //localStorage.setItem("docId", players)
      });
      return unsubscribe;
    }
  }, [authenticatedUser, email, db, currentGameInfo]);

  useEffect(() => {
    const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        setIsGameStarted(doc.data().isStarted);
      } else {
        console.log("No such document!");
      }
    });
    return unsubscribe;
  }, [gameRef]);

  const startGame = async () => {
    await updateDoc(gameRef, {
      isStarted: true,
    }).then(() => {
      navigate("/Game");
    });
  };

  return (
    <div className="container-lg">
      <div className="row justify-content-center">
        <div className="col-md-5 text-center">
          {authenticatedUser ? (
            <>
              <p className="text-light display-5">
                Welcome to the waiting room
              </p>

              <table class="table">
                <thead>
                  <tr class="table-light">
                    <th scope="col">Name</th>
                    <th scope="col">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr class="table-light" key={player.id}>
                      <td>{player.name}</td>
                      <td>{player.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {role === "host" ? (
                <button
                  className="btn btn-dark display-6"
                  onClick={() => startGame()}
                >
                  Start game
                </button>
              ) : (
                <>
                  <p>Waiting for host to start game.</p>
                  {isGameStarted && navigate("/Game")}
                </>
              )}
            </>
          ) : (
            <>
              <p className="display-5 text-center">
                Must be logged in to play.
              </p>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => navigate("/Login")}
              >
                Go to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
