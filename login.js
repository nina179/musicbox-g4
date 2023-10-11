
/*
const CLIENT_ID = "+++++++++++++++++++++++++++++"
const REDIRECT_URI = "http://localhost:3000"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"

const [token, setToken] = useState("")
*/

const CLIENT_ID = 'YOUR_CLIENT_ID';
const REDIRECT_URI = 'http://localhost:8080';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize?';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const PROFILE_ENDPOINT = 'https://api.spotify.com/v1/me';

function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

async function generateCodeChallenge(codeVerifier) {
    function base64encode(string) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
  
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
  
    return base64encode(digest);
  }

function requestUserAuth() {
  let codeVerifier = generateRandomString(128);

  generateCodeChallenge(codeVerifier).then(codeChallenge => {
    let state = generateRandomString(16);
    let scope = 'user-read-private user-read-email';

    localStorage.setItem('code_verifier', codeVerifier);

    let args = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
    });

    window.location = AUTH_ENDPOINT + args;
  });
}

function oAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');

  let codeVerifier = localStorage.getItem('code_verifier');

  let body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier
  });

  const response = fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP status ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      localStorage.setItem('access_token', data.access_token);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


async function getProfile(accessToken) {
  let accessToken = localStorage.getItem('access_token');

  const response = await fetch(PROFILE_ENDPOINT, {
      headers: {
      Authorization: 'Bearer ' + accessToken
      }
  });

  const data = await response.json();
}