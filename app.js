/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const { useState, useEffect } = React;

// List of the top 10 largest countries by area
const wordList = ["Russia", "Canada", "China", "USA", "Brazil", "Australia", "India", "Argentina", "Kazakhstan", "Algeria"];

// Function to shuffle a single word
function shuffleWord(word) {
  return word.split('').sort(() => Math.random() - 0.5).join('');
}

// Scramble Game Component
function ScrambleGame() {
  const maxStrikes = 3;
  const maxPasses = 3;

  // Load game state from localStorage or initialize with default values
  const [words, setWords] = useState(() => JSON.parse(localStorage.getItem("words")) || [...wordList]);
  const [currentWord, setCurrentWord] = useState(() => shuffleWord(words[0] || ""));
  const [score, setScore] = useState(() => Number(localStorage.getItem("score")) || 0);
  const [strikes, setStrikes] = useState(() => Number(localStorage.getItem("strikes")) || 0);
  const [passes, setPasses] = useState(() => Number(localStorage.getItem("passes")) || maxPasses);
  const [input, setInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState(""); // Added message feedback

  // Save game state whenever values change
  useEffect(() => {
    localStorage.setItem("words", JSON.stringify(words));
    localStorage.setItem("score", score);
    localStorage.setItem("strikes", strikes);
    localStorage.setItem("passes", passes);
  }, [words, score, strikes, passes]);

  // Handle user guess
  function handleGuess() {
    if (input.trim().toLowerCase() === words[0].trim().toLowerCase()) {
      setScore(prev => prev + 1);
      setMessage("✅ Correct!");
      moveToNextWord();
    } else {
      setStrikes(prev => {
        const newStrikes = prev + 1;
        if (newStrikes >= maxStrikes) setGameOver(true);
        return newStrikes;
      });
      setMessage("❌ Incorrect!");
    }
    setInput("");
  }

  // Move to the next word
  function moveToNextWord() {
    const newWords = words.slice(1);
    setWords(newWords);
    if (newWords.length > 0) {
      setCurrentWord(shuffleWord(newWords[0]));
    } else {
      setCurrentWord("");
      setGameOver(true);
    }
  }

  // Handle pass button
  function handlePass() {
    if (passes > 0) {
      setPasses(prev => prev - 1);
      setMessage("⏭️ Skipped!");
      moveToNextWord();
    }
  }

  // Reset the game
  function resetGame() {
    const shuffledWords = [...wordList];
    setWords(shuffledWords);
    setCurrentWord(shuffleWord(shuffledWords[0]));
    setScore(0);
    setStrikes(0);
    setPasses(maxPasses);
    setGameOver(false);
    setMessage("");

    // Remove only game-related localStorage items
    localStorage.removeItem("words");
    localStorage.removeItem("score");
    localStorage.removeItem("strikes");
    localStorage.removeItem("passes");
  }

  return (
    <div>
      <h1>Scramble Game</h1>
      {gameOver ? (
        <div>
          <h2>Game Over</h2>
          <p>Final Score: {score}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        <div>
          <h2>Word: {currentWord || "Loading..."}</h2>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGuess()} 
          />
          <button onClick={handleGuess}>Submit</button>
          <button onClick={handlePass} disabled={passes === 0}>Pass ({passes} left)</button>
          <p className={`message ${message.includes("Correct") ? "success" : "error"}`}>{message}</p>
          <p>Score: {score}</p>
          <p>Strikes: {strikes}/{maxStrikes}</p>
        </div>
      )}
    </div>
  );
}

// Rendering into #root div
ReactDOM.createRoot(document.getElementById("root")).render(<ScrambleGame />);