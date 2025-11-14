import { useEffect } from 'react'
import { useAuthorProvider } from '../providers/useAuthorProvider'
import { AuthorListItem } from './AuthorListItem'
import { CreateAuthorModal } from './CreateAuthorModal'

export function AuthorList() {
  const { authors, loadAuthors, deleteAuthor, updateAuthor, createAuthor } =
    useAuthorProvider()

  useEffect(() => {
    loadAuthors()
  }, [])

  return (
    <>
      <CreateAuthorModal onCreate={createAuthor} />
      <div style={{ padding: '0 .5rem' }}>
        {authors.map(author => (
          <AuthorListItem
            key={author.id}
            author={author}
            onDelete={deleteAuthor}
            onUpdate={updateAuthor}
          />
        ))}
      </div>
    </>
  )
}
