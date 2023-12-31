class Api {
  constructor({baseUrl, headers}) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }
  
  _checkRes(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'GET',
      credentials: 'include',
      headers: this._headers,
    })
    .then((res) => this._checkRes(res));
  }
  
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      credentials: 'include',
      headers: this._headers,
    })
    .then((res) => this._checkRes(res));
  }

  patchUserInfo({name, about}) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
    .then((res) => this._checkRes(res));
  }
  
  postNewCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link
      })
    })
    .then((res) => this._checkRes(res));
  }

  likeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'PUT',
      credentials: 'include',
      headers: this._headers
    })
    .then((res) => this._checkRes(res));
  }

  dislikeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this._headers
    })
    .then((res) => this._checkRes(res));
  }

  deleteCard(idCard) {
    return fetch(`${this._baseUrl}/cards/${idCard}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this._headers
    })
    .then((res) => this._checkRes(res));
  }

  patchAvatar(data) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        avatar: data["avatar"],
      })
    })
    .then((res) => this._checkRes(res));
  }

  // Новый спринт
  changeLikeCardStatus(cardId, isLiked) {
		return isLiked ? this.likeCard(cardId) : this.dislikeCard(cardId)
	};
}



const api = new Api({
  // baseUrl: 'http://localhost:3001',
  baseUrl: 'https://api.klyuev-mesto.nomoreparties.co',
  headers: {
    authorization: '64e76916-bb9d-45f2-aa0a-555c04a49e1a',
    'Content-Type': 'application/json'
  }
});

export default api;