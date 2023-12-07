import Head from "next/head";
import { useState, useEffect } from "react";
import getFirebase from "../services/firebase/client";
export default function Home() {
  const personas = [
    "jose",
    "angel",
    "kelly",
    "koraima",
    "genesis",
    "jose angel",
  ];
  const [selectedPerson, setSelectedPerson] = useState(personas[0]);
  const [resultado, setResultado] = useState("");
  const [secretFriend, setSecretFriend] = useState();
  const [participants, setParticipants] = useState([]);
  console.log(secretFriend);

  useEffect(() => {
    setSecretFriend()

    getFirebase()
      .firestore()
      .collection("people")
      .where("available", "==", true)
      .onSnapshot((users) => {
        const resp = users.docs.map((doc) => {
          const data = doc.data();
          return data;
        });
        setParticipants(resp);
      });

    if (selectedPerson) {
      getFirebase()
        .firestore()
        .collection("people")
        .where("name", "==", selectedPerson)
        .onSnapshot((users) => {
          const resp = users.docs.map((doc) => {
            const data = doc.data();
            return data;
          });
          const userInfo = resp[0]
          if (userInfo?.secretFriend) {

            setSecretFriend(userInfo.secretFriend);
          }
        });
    }
  }, [selectedPerson]);

  const getRandomElement = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  const realizarSorteo = () => {
    const participantsAvailable = participants
      .filter((obj) => {
        if (selectedPerson === "jose") {
          return obj.name !== "koraima" && obj.name !== "kelly";
        }
        if (selectedPerson === "angel") {
          return obj.name !== "koraima";
        }
        if (selectedPerson === "koraima") {
          return obj.name !== "angel" && obj.name !== "jose";
        }
        if (selectedPerson === "kelly") {
          return obj.name !== "genesis";
        }
        if (selectedPerson === "genesis") {
          return obj.name !== "kelly";
        }
        return obj;
      })
      .filter((obj) => obj.name !== selectedPerson);
    const getRandomParticipant = getRandomElement(participantsAvailable);

    try {
      if (getRandomParticipant) {
        getFirebase()
          .firestore()
          .collection("people")
          .doc(`${getRandomParticipant.name}`)
          .update({ available: false });
        getFirebase()
          .firestore()
          .collection("people")
          .doc(`${selectedPerson}`)
          .update({ secretFriend: `${getRandomParticipant.name}` });
        setSecretFriend(getRandomParticipant);
      }
    } catch (error) {}
  };

  // const everTrue = () => {
  //   personas.map((person) => {
  //     getFirebase()
  //       .firestore()
  //       .collection("people")
  //       .doc(`${person}`)
  //       .update({ available: true });
  //       getFirebase()
  //       .firestore()
  //       .collection("people")
  //       .doc(`${person}`)
  //       .update({ secretFriend: "" });
  //   });
   
  // };

  // everTrue();

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div style={styles.container}>
          <h1 style={styles.heading}>Amigo Secreto</h1>
          <label htmlFor="selectPerson" style={styles.label}>
            Selecciona tu nombre:
          </label>
          <select
            id="selectPerson"
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
            style={styles.select}
          >
            {personas.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
          <button
            onClick={realizarSorteo}
            style={styles.button}
            disabled={!!secretFriend}
          >
            Realizar Sorteo
          </button>
          <p id="resultado" style={styles.resultado}>
            {secretFriend && "Tu amigo secreto es: " + secretFriend}
          </p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    display:"flex",
    flexDirection: "column",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "10px",
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },
  resultado: {
    fontSize: "16px",
  },
};
