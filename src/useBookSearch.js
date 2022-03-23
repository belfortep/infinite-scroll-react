import { useEffect, useState } from 'react'
import axios from 'axios'
//custom Hook
export default function useBookSearch(query, pageNumber) {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [books, setBooks] = useState([])
    const [hasMore, setHasMore] = useState(false)//si tiene o no mas libros

    useEffect(() => {
        setBooks([])
    }, [query])

    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel //para cancelar la request

        axios({
            method: 'GET',
            url: 'http://openlibrary.org/search.json',
            params: { q: query, page: pageNumber }, //en la API de openlibrary se pueden pasar estos parametros
            cancelToken: axios.CancelToken(c => cancel = c)
        }).then(res => {
            setBooks(prevBooks => {

                return [...new Set([...prevBooks, ...res.data.docs.map(b => b.title)])]//lo convierto a un Set para eliminar duplicados, y despues devuelta a un Array

            })
            setHasMore(res.data.docs.length > 0)
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })
        return () => cancel()

    }, [query, pageNumber])

    return { loading, error, books, hasMore }
}
