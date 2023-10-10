import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react';


function App() {
  const CLIENT_ID = "+++++++++++++++++++++++++++++"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split("&").find(element = element.startsWith("access_token")).split("=")[1]
      
      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }

    setToken(token)

  }, [])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tuneify React</h1>
        {!token ?
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_url=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
            Login to Spotify</a>
            : <button onClick={logout}>Logout</button>}
      </header>
    </div>
  );
}

export default App;
