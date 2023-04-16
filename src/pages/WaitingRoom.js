import { useState, useEffect, useContext, useRef } from "react";
import { db, doc, getDoc, collection, onSnapshot, query, where, updateDoc, orderBy } from "../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { GameContext } from "../contexts/GameContext";

const WaitingRoom = () => {
    const { currentUser } = useContext(AuthContext);
    const { gameInfo, getPlayers, players, getPlayerDocID } = useContext(GameContext);

    const accessCode = JSON.stringify(gameInfo.access);
    console.log("game info: ", gameInfo);
    console.log("access code: ", accessCode);
    
    //const [players, setPlayers] = useState([]);
    const [role, setRole] = useState("player");
    const [isGameStarted, setIsGameStarted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGameStarted = async () => {
            if (currentUser) {
                try {
                    const gameRef = doc(db, "GameId", accessCode);
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
        fetchGameStarted();
    }, [currentUser, db]);

    useEffect(() => {
        if (gameInfo) {
            const q = query(collection(db, "players"), where("gameID", "==", gameInfo.access));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const updatedPlayers = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                getPlayers(updatedPlayers);
                console.log(players.id);
                

                const isCreatedByCurrentUser = currentUser.email === gameInfo.createdBy;
                if (isCreatedByCurrentUser) {
                    setRole("host");
                }
                console.log("createdBy: ", gameInfo.createdBy);
                console.log("role: ", role);
                //sessionStorage.setItem("docId", players)
            });
            return unsubscribe;
        }
    }, [currentUser, db, gameInfo]);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "GameId", accessCode), (doc) => {
            if (doc.exists()) {
                setIsGameStarted(doc.data().isStarted);
            } else {
                console.log("No such document!");
            }
        });
        return unsubscribe;
    }, [db]);

    const startGame = async () => {
        await updateDoc(doc(db, "GameId", accessCode), {
            isStarted: true
        })
            .then(() => {
                navigate("/Game");
            })
    };

    return (
        <div className="container-lg text-white">
            <div className='row justify-content-center'>
                <div className="col-md-5 text-center">
                    {currentUser ? (
                        <>
                            <p>Welcome to the waiting room</p>
                            {(role === "host") && (!isGameStarted) ? (
                                <button onClick={() => startGame()}>Start game</button>
                            ) : (
                                <>
                                {}
                                    <p>Waiting for host to start game.</p>
                                    {isGameStarted && navigate("/Game")}
                                </>
                            )}
                            
                                <table className="table">
                                    <thead>
                                        <tr className="table-light">
                                            <th scope="col">Name</th>
                                            <th scope="col">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {players.map((player) => (
                                            <tr  className="table-light" key={player.id}>
                                                <td>{player.name}</td>
                                                <td>{player.role}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            

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
    )
};

export default WaitingRoom;
