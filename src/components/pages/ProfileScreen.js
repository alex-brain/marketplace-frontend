import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, updateUserProfile } from '../../redux/actions/userProfileActions';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import './ProfileScreen.css';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const { loading, error, profile } = useSelector(state => state.userProfile);
  const { success } = useSelector(state => state.userProfile);

  useEffect(() => {
    if (!profile?.name) {
      dispatch(getUserProfile());
    } else {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [dispatch, profile]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Пароли не совпадают');
    } else {
      // Обновить профиль пользователя
      dispatch(updateUserProfile({
        name,
        email,
        password: password ? password : undefined
      }));
    }
  };

  return (
    <div className="profile-container">
      <h2>Мой профиль</h2>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">Профиль успешно обновлен</Message>}
      {loading ? <Loader /> : (
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>Имя</label>
            <input
              type="text"
              placeholder="Введите имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              placeholder="Введите новый пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Подтвердите пароль</label>
            <input
              type="password"
              placeholder="Подтвердите новый пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Обновить
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfileScreen;