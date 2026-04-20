// Local storage utilities for songs and artists management

export interface Song {
  id: string
  title: string
  genre: string
  releaseDate?: string
  platform?: string
  legalMeta?: string
  userId: string
  user: {
    id: string
    email: string
    name: string
  }
  artists: Array<{
    artist: {
      id: string
      name: string
    }
  }>
  authors: Array<{
    author: {
      id: string
      name: string
    }
  }>
}

export interface Artist {
  id: string
  name: string
}

export interface Author {
  id: string
  name: string
}

// Storage keys
const SONGS_KEY = 'music-rights-songs'
const ARTISTS_KEY = 'music-rights-artists'
const AUTHORS_KEY = 'music-rights-authors'

// Initialize default data
let songs: Song[] = []
let artists: Artist[] = []
let authors: Author[] = []

// Load data from localStorage
const loadFromStorage = () => {
  if (typeof window === 'undefined') return

  const storedSongs = localStorage.getItem(SONGS_KEY)
  const storedArtists = localStorage.getItem(ARTISTS_KEY)
  const storedAuthors = localStorage.getItem(AUTHORS_KEY)

  if (storedSongs) songs = JSON.parse(storedSongs)
  if (storedArtists) artists = JSON.parse(storedArtists)
  if (storedAuthors) authors = JSON.parse(storedAuthors)
}

// Save data to localStorage
const saveToStorage = () => {
  if (typeof window === 'undefined') return

  localStorage.setItem(SONGS_KEY, JSON.stringify(songs))
  localStorage.setItem(ARTISTS_KEY, JSON.stringify(artists))
  localStorage.setItem(AUTHORS_KEY, JSON.stringify(authors))
}

// Initialize on first load
if (typeof window !== 'undefined') {
  loadFromStorage()
}

// Songs functions
export const getSongs = (userId?: string) => {
  loadFromStorage()
  if (userId) {
    return songs.filter(song => song.userId === userId)
  }
  return songs
}

export const getSongById = (id: string) => {
  loadFromStorage()
  return songs.find(song => song.id === id)
}

export const createSong = (songData: Omit<Song, 'id' | 'artists' | 'authors'>) => {
  loadFromStorage()

  const newSong: Song = {
    ...songData,
    id: Date.now().toString(),
    artists: [],
    authors: []
  }

  songs.push(newSong)
  saveToStorage()
  return newSong
}

export const updateSong = (id: string, songData: Partial<Song>) => {
  loadFromStorage()

  const index = songs.findIndex(song => song.id === id)
  if (index === -1) return null

  songs[index] = { ...songs[index], ...songData }
  saveToStorage()
  return songs[index]
}

export const deleteSong = (id: string) => {
  loadFromStorage()

  const index = songs.findIndex(song => song.id === id)
  if (index === -1) return false

  songs.splice(index, 1)
  saveToStorage()
  return true
}

// Artists functions
export const getArtists = () => {
  loadFromStorage()
  return artists
}

export const getArtistByName = (name: string) => {
  loadFromStorage()
  return artists.find(artist => artist.name.toLowerCase() === name.toLowerCase())
}

export const createArtist = (name: string) => {
  loadFromStorage()

  let artist = getArtistByName(name)
  if (artist) return artist

  artist = {
    id: Date.now().toString(),
    name
  }

  artists.push(artist)
  saveToStorage()
  return artist
}

// Authors functions
export const getAuthors = () => {
  loadFromStorage()
  return authors
}

export const getAuthorByName = (name: string) => {
  loadFromStorage()
  return authors.find(author => author.name.toLowerCase() === name.toLowerCase())
}

export const createAuthor = (name: string) => {
  loadFromStorage()

  let author = getAuthorByName(name)
  if (author) return author

  author = {
    id: Date.now().toString(),
    name
  }

  authors.push(author)
  saveToStorage()
  return author
}

// Song-Artist relations
export const addArtistToSong = (songId: string, artistName: string) => {
  loadFromStorage()

  const song = songs.find(s => s.id === songId)
  if (!song) return false

  const artist = createArtist(artistName)

  // Check if already added
  const exists = song.artists.some(a => a.artist.id === artist.id)
  if (exists) return true

  song.artists.push({ artist })
  saveToStorage()
  return true
}

export const removeArtistFromSong = (songId: string, artistId: string) => {
  loadFromStorage()

  const song = songs.find(s => s.id === songId)
  if (!song) return false

  song.artists = song.artists.filter(a => a.artist.id !== artistId)
  saveToStorage()
  return true
}

// Song-Author relations
export const addAuthorToSong = (songId: string, authorName: string) => {
  loadFromStorage()

  const song = songs.find(s => s.id === songId)
  if (!song) return false

  const author = createAuthor(authorName)

  // Check if already added
  const exists = song.authors.some(a => a.author.id === author.id)
  if (exists) return true

  song.authors.push({ author })
  saveToStorage()
  return true
}

export const removeAuthorFromSong = (songId: string, authorId: string) => {
  loadFromStorage()

  const song = songs.find(s => s.id === songId)
  if (!song) return false

  song.authors = song.authors.filter(a => a.author.id !== authorId)
  saveToStorage()
  return true
}

// Stats
export const getStats = () => {
  loadFromStorage()

  return {
    totalSongs: songs.length,
    totalArtists: artists.length,
    totalAuthors: authors.length,
    totalUsers: 1 // Since we're using local storage, we don't track multiple users
  }
}