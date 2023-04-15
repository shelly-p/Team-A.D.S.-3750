import { useState, useEffect, useContext } from "react";
import { db, query, collection, where, getDocs } from "../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function Profile() {
  const { currentUser, username } = useContext(AuthContext);
  const [pointsTotal, setPointsTotal] = useState(null);
  const [gamesCreated, setGamesCreated] = useState(null);
  const navigate = useNavigate();

  // Getting users total points
  useEffect(() => {
    const fetchPoints = async () => {
        if (currentUser) {
            try {
                const leaderboardRef = collection(db, "leaderboard");
                const q = query(leaderboardRef, where("email", "==", currentUser.email));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    setPointsTotal(doc.data().pointsTotal);
                });
            } catch (error) {
                console.log(error);
            }
        }
    };
    fetchPoints();
}, [currentUser]);

  //Getting the amount of times the user has created a game
  useEffect(() => {
    const fetchGamesCreated = async () => {
      if (currentUser) {
        try {
          const q = query(collection(db, "GameId"), where("createdBy", "==", currentUser.email))
          const querySnapshot = await getDocs(q);
          setGamesCreated(querySnapshot.size);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchGamesCreated();
  }, [currentUser]);

  return (
    <>
     {currentUser ? (
        <>
         <div>
        <h2>Profile</h2>
        <p>Email: {currentUser.email}</p>
        <p>Username: {username}</p>
        <p>Total Points: {pointsTotal}</p>
        <p>Games Created: {gamesCreated}</p>
        </div>
        </>
      ) : (
        <>
          {navigate("/Home")};
        </>
      )};
    </>
    
  );
}

export default Profile;

