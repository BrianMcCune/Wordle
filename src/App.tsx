import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import gsap from 'gsap';
// import { useGSAP } from '@gsap/react';

type currentGuess = {
  letter: string,
  color: string
}

function App() {

  const answer = 'pizza'
  const ref = useRef<HTMLDivElement | null>(null)

  const [guess, setGuess] = useState<string>('')
  const [guesses, setGuesses] = useState<currentGuess[][]>([])
  const [error, setError] = useState<string>('')
  const [win, setWin] = useState<string>('')

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current.children,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.3 }
      )
    }
  }, [guesses])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(e.target.value.toLowerCase())
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()
    if (win !== '') return
    if (guess.length != 5) {
      return setError('Please enter a word with 5 letters')
    }

    const freq: Record<string, number> = {}

    for (const letter of answer) {
      freq[letter] = (freq[letter] || 0) + 1
    }

    const currentGuess: currentGuess[] = []

    for (let i = 0; i < guess.length; i++) {
      if (answer[i] === guess[i]) {
        currentGuess.push({letter:guess[i], color: 'green'})
        freq[guess[i]]--
      } else currentGuess.push({letter:guess[i], color: 'grey'})
    }

    for (let i = 0; i < guess.length; i++) {
      if (currentGuess[i].color === 'grey' && freq[currentGuess[i].letter] > 0) {
        currentGuess[i].color = 'yellow'
        freq[currentGuess[i].letter]--
      }
    }

    console.log(currentGuess)

    
    const nextGuesses = [...guesses, currentGuess]
    setGuesses(nextGuesses)

    if (nextGuesses.length === 6) {
      setWin('You Have Lost :(')
      return
    }


    if (guess === answer) {
      setWin('Congratulations, You Won!')
      return
    }

    
    setGuess('')
  }



  return (
    <>
      <div className='guesses-container'>
        {guesses.map((guess, i) => (
          <div ref={i === guesses.length - 1 ? ref : undefined}  className='guesses' key={i}>{guess.map(({letter, color}, j) => (
            <div className={color} key={j} >{letter}</div>
          ))}</div>
        ))}
      </div>
      <div>{error}</div>
      <div>{win}</div>
      <form onSubmit={handleSubmit}>
        <input value={guess} type='text' onChange={handleChange} maxLength={5} required/>
        <button type='submit'>Submit Guess</button>
      </form>
    </>
  )
}

export default App
