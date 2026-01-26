const fetchMovies = async () => {
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=a687c20174983fe7d8ade1c3256b84b4&query=john-wick
`)

const data = await res.json()
console.log(data)


}

fetchMovies()