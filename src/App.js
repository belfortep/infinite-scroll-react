import useBookSearch from "./useBookSearch";
import { useState, useRef, useCallback } from 'react'
import './app.css'
function App() {


  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const {
    books,
    hasMore,
    loading,
    error
  } = useBookSearch(query, pageNumber)
  //useRef persiste aun despues de cada render
  const observer = useRef()
  //cada vez que se crea este elemento, se utiliza la funcion de useCallback
  const lastBookElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {  //isIntersecting, si es que se esta viendo en pantalla
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  function handleSearch(e) {
    setQuery(e.target.value)
    setPageNumber(1)
  }



  return (
    <div className="container">
      <input type="text" value={query} onChange={handleSearch}></input>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return <div ref={lastBookElementRef} key={book}>{book}</div>
        } else {
          return <div key={book}>{book}</div>
        }

      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </div>
  )
}

export default App;
