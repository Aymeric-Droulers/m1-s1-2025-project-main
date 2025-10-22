import { useState } from 'react'
import './App.css'
import { Hello } from './Hello'

function App() {
  const [name, setName] = useState<string>('')
  const [newName, setNewName] = useState<string>('')

  const onValidate = () => {
    setName(newName)
    setNewName('')
  }

  return (
    <>
      <Hello name={name}>How are you man ?</Hello>
      <input value={newName} onChange={e => setNewName(e.target.value)} />
      <button onClick={onValidate}>OK</button>
      <h3>This is a subtitle</h3>
    </>
  )
}

export default App
