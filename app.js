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
  return shuffle(word);
}

function ScrambleGame() {
  const maxStrikes = 3; // Maximum wrong guesses allowed
  const maxPasses = 3; // Maximum times the player can skip a word

  // Load game state from localStorage or initialize with default values
  const [words, setWords] = useState(() => JSON.parse(localStorage.getItem("words")) || shuffle([...wordList]));
  const [currentWord, setCurrentWord] = useState(() => shuffleWord(words[0] || ""));
  const [score, setScore] = useState(() => Number(localStorage.getItem("score")) || 0);
  const [strikes, setStrikes] = useState(() => Number(localStorage.getItem("strikes")) || 0);
  const [passes, setPasses] = useState(() => Number(localStorage.getItem("passes")) || maxPasses);
  const [input, setInput] = useState("");
  const [gameOver, setGameOver] = useState(false);

  // Save game state whenever values change
  useEffect(() => {
    localStorage.setItem("words", JSON.stringify(words));
    localStorage.setItem("score", score);
    localStorage.setItem("strikes", strikes);
    localStorage.setItem("passes", passes);
  }, [words, score, strikes, passes]);

  // Function to handle user guess
  function handleGuess() {
    if (input.toLowerCase() === words[0].toLowerCase()) {
      setScore(score + 1);
      moveToNextWord();
    } else {
      setStrikes(strikes + 1);
      if (strikes + 1 >= maxStrikes) setGameOver(true);
    }
    setInput(""); // Clear input field after guess
  }

  // Function to move to the next word after a correct guess or pass
  function moveToNextWord() {
    const newWords = words.slice(1);
    setWords(newWords);
    setCurrentWord(newWords.length > 0 ? shuffleWord(newWords[0]) : "");
    if (newWords.length === 0) setGameOver(true);
  }

  // Function to handle pass (skip the word)
  function handlePass() {
    if (passes > 0) {
      setPasses(passes - 1);
      moveToNextWord();
    }
  }

  // Function to reset the game when it's over
  function resetGame() {
    setWords(shuffle([...wordList]));
    setCurrentWord(shuffleWord(wordList[0]));
    setScore(0);
    setStrikes(0);
    setPasses(maxPasses);
    setGameOver(false);
    localStorage.clear();
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
          <h2>Word: {currentWord}</h2>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleGuess()}
          />
          <button onClick={handleGuess}>Submit</button>
          <button onClick={handlePass} disabled={passes === 0}>Pass ({passes} left)</button>
          <p>Score: {score}</p>
          <p>Strikes: {strikes}/{maxStrikes}</p>
        </div>
      )}
    </div>
  );
}

// Render the game inside the webpage
ReactDOM.createRoot(document.body).render(<ScrambleGame />);
