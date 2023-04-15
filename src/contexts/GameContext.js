import { useContext, createContext, useState } from "react";
import { collection, db, doc, getDoc, query, where, getDocs, updateDoc, addDoc, playerCollectionRef } from "../firebase";
import { arrayUnion } from "firebase/firestore";

export const GameContext = createContext();

export function GameProvider({ children }) {
    const [gameInfo, setGameInfo] = useState([]);
    
    const [playerDocID, setPlayerDocID] = useState();
    const [players, setPlayers] = useState([]);



    const getPlayerDocID = (docId) => {
        setPlayerDocID(docId);
        console.log(playerDocID);
    }

    const getPlayers = (list) => {
        setPlayers(list);
    }

    const getGameInfo = (gameData) => {
        setGameInfo(gameData);
    }

    const value = {
        gameInfo,
        //isCodeVerified,
        playerDocID,
        players,
        getPlayerDocID,
       getGameInfo,
        getPlayers
    };
    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}