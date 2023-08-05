import React from 'react';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import PopupWithForm from './PopupWithForm.js';
import ImagePopup from './ImagePopup.js';
import api from '../utils/Api.js'; // Новые импорты
import CurrentUserContext from '../contexts/CurrentUserContext.js';
import EditProfilePopup from '../components/EditProfilePopup.js';
import EditAvatarPopup from '../components/EditAvatarPopup.js';
import AddPlacePopup from '../components/AddPlacePopup.js'; // ---

function App() {
  // Поднятие карточек и данных о профиле с сервера
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
    .then((res) => {
      const [Userdata, Cardsdata] = res;
        setCurrentUser(Userdata);
        setCards(Cardsdata);
    })
    .catch((err) => {
      console.log(err);
    });
  },[]);
  //---
  
  // Обработчик лайка карточки
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
    .catch((err) => console.log(err));
  }
  //---

  // Обработчик удаления карточки
  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then(() => {
      setCards((state) => state.filter((c) => c._id !== card._id));
    })
    .catch((err) => {
      console.log(err);
    });
  }
  //---

  // Стейты попапов и функции их открытия + закрытие
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({});
  }
  //---

  // Обработчик изменения профиля (в инпут попадают данные из попапа)
  function handleUpdateUser(name, about) {
    api.patchUserInfo(name, about)
    .then((data) => {
      setCurrentUser(data);
    })
    .then(() => closeAllPopups())
    .catch((err) => console.log(err));
    
  }
  //---
  
  // Обработчик изменения аватара (в инпут попадают данные из попапа)
  function handleUpdateAvatar(avatar) {
    api.patchAvatar(avatar)
    .then((data) => {
      setCurrentUser(data);
    })
    .then(() => closeAllPopups())
    .catch((err) => console.log(err));
  }
  //---

  // Обработчик добавления карточки (в инпут попадают данные из попапа)
  function handleAddPlaceSubmit(name, link) {
    api.postNewCard(name, link)
    .then((newCard) => setCards([newCard, ...cards]))
    .then(() => closeAllPopups())
    .catch((err) => console.log(err));
  }
  //---

  return (
    <CurrentUserContext.Provider value={currentUser} >
      <div className="page">
        <Header />
        <Main
          onCardLike={handleCardLike}
          cards={cards}
          onEditProfile={handleEditProfileClick}
          onEditAvatar={handleEditAvatarClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          onCardDelete={handleCardDelete}
        />
        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen} 
          onClose={closeAllPopups}
          onUpdateUser = {handleUpdateUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onUpdateCard={handleAddPlaceSubmit}
        />

        <PopupWithForm 
          name = "delete"
          title = "Вы уверены?"
          nameButtonSave = "Да"
        />

        <ImagePopup 
          card={selectedCard} 
          onClose = {closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;