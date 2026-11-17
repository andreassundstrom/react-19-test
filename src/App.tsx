import { useOptimistic, useState, useTransition } from 'react'
import './App.css'

type Note = {
  noteId: number,
  note: string,
  status: 'pending' | 'created'
}

function App() {
  const [inputText,setInputText] = useState<string>('')
  const [notes, setNotes] = useState<Note[]>([
    {
      noteId: 1,
      note: 'Text 1',
      status: 'created'
    }
  ])
  const [isPending, startTransition] = useTransition()
  const [currentNotes, addNewNote] = useOptimistic(notes,(currentNotes : Note[], newNote : Note) => {

    return [...currentNotes.filter(p => p.noteId !== newNote.noteId), newNote as Note]
  })

    function handleClick(note: Note){
      startTransition(async () => {
        await addNew(note)
      })
    }
    
    async function addNew(note:Note){
    addNewNote({...note, status:'pending'})
    await new Promise(resolve => setTimeout(resolve,1500))
    setNotes(prev => [...prev, note])
    setInputText('')
  }
  return (
    <>
    <div style={{display:'flex', flexDirection:'column',height:'500px',overflowY:'auto', maxWidth:'500px'}}>
      {currentNotes.map(note => <p className={`note ${note.status}`} key={note.noteId}>{note.note}</p>)}
    </div>
      <div style={{display:'flex'}}>
      <input disabled={isPending} type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} />
      <button disabled={isPending} onClick={() => handleClick({note: inputText, noteId: Date.now(), status: 'created'})}>Skapa ny {isPending && '...'}</button>
      </div>
    </>
  )
}

export default App
