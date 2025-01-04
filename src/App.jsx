import { useState } from "react";
import { languages } from "./languages.js";
import { clsx } from "clsx";
import Confetti from "react-confetti";
import { getRandomWord, getFarewellText } from "./utils.js";

function App() {
  // State
  const [currentWord, setCurrentWord] = useState(getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);

  // constants
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Derived values from state
  const remainingGuesses = languages.length - 1;
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.toUpperCase().includes(letter)
  ).length;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];

  const isGameLost = wrongGuessCount >= remainingGuesses;
  const isGameWon = currentWord
    .toUpperCase()
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameOver = isGameLost || isGameWon;

  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.toUpperCase().includes(lastGuessedLetter);

  // functions
  function addGuessedLetter(letter) {
    !guessedLetters.includes(letter)
      ? setGuessedLetters((previousGuessedLetters) => {
          return [...previousGuessedLetters, letter];
        })
      : null;
  }

  const chipElement = languages.map((language, index) => {
    const styleObj = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    };
    const lostLanguage = "lost-language";

    const className = clsx(
      `py-1 px-2 rounded font-medium relative`,
      index < wrongGuessCount && lostLanguage
    );

    return (
      <span key={language.name} className={className} style={styleObj}>
        {language.name}
      </span>
    );
  });

  const letterElements = currentWord
    .toUpperCase()
    .split("")
    .map((letter, index) => {
      const isGuessed = guessedLetters.includes(letter);
      const isRemainingLetter = isGameLost && !isGuessed;

      return (
        <span
          key={index}
          className={`w-10 h-10 bg-stone-700 flex justify-center items-center border-b-2 border-stone-300 text-white text-lg font-medium ${
            isRemainingLetter ? "text-red-600" : ""
          }`}
        >
          {isGuessed || isRemainingLetter ? letter : ""}
        </span>
      );
    });

  const keyboardElements = alphabets.map((letter, index) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.toUpperCase().includes(letter);
    const isWrong = isGuessed && !currentWord.toUpperCase().includes(letter);

    let style = {
      backgroundColor: isCorrect ? "#10a95b" : isWrong ? "#ec5d49" : "#ffc107",
    };

    return (
      <button
        onClick={() => addGuessedLetter(letter)}
        key={index}
        className={`w-10 h-10 flex justify-center items-center rounded border-stone-300 border-[1px] font-medium disabled:opacity-50`}
        style={style}
        disabled={isGameOver ? true : false}
      >
        {letter}
      </button>
    );
  });

  function startNewGame() {
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
  }

  const backgroundStyle = clsx({
    "bg-green-600": isGameWon,
    "bg-red-600": isGameLost,
    "bg-purple-600 border-2 border-dashed border-purple-400 italic":
      !isGameOver && isLastGuessIncorrect,
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="text-base">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      );
    }

    if (isGameWon) {
      return (
        <>
          <h2 className="text-xl">You win!</h2>
          <p className="text-base">Well Done 🎉</p>
        </>
      );
    }

    if (isGameLost) {
      return (
        <>
          <h1 className="text-xl">Game over!</h1>
          <p className="text-base">
            You lose! Better start learning Assembly 😭
          </p>
        </>
      );
    }

    return null;
  }

  return (
    <main className="flex flex-col items-center justify-center box-border h-dvh gap-12 -mt-4">
      {isGameWon && (
        <Confetti numberOfPieces={2000} frameRate={120} recycle={false} />
      )}
      <section className="flex flex-col items-center gap-5">
        <section className="game-description text-slate-100  max-w-[350px] text-center">
          <h1 className="text-2xl text-stone-200">Assembly: Endgame</h1>
          <p className="text-sm text-stone-400 opacity-80">
            Guess the word in under 8 attempts to keep the programming world
            safe from Assembly!
          </p>
        </section>
        <section
          className={`py-1 game-status h-16 w-[350px] text-stone-200 flex flex-col justify-center items-center text-center rounded ${backgroundStyle}`}
        >
          {renderGameStatus()}
        </section>
      </section>
      <section className="chips-holder max-w-96 flex flex-wrap justify-center gap-[3px]">
        {chipElement}
      </section>
      <section className="max-w-96 flex justify-center gap-1">
        {letterElements}
      </section>
      <section className="max-w-[350px] flex justify-center gap-2 flex-wrap">
        {keyboardElements}
      </section>

      <section className="w-56 h-12">
        {isGameOver && (
          <button
            onClick={startNewGame}
            className="bg-blue-400 w-56 h-12 rounded"
          >
            New Game
          </button>
        )}
      </section>
    </main>
  );
}

export default App;
