import { Link, Page } from 'framework7-react';
import '../css/login.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useInput from '../hooks/useInput';

const Login = ({ f7router }) => {
  const [id, onChangeID] = useInput('');
  const [password, onChangePassword] = useInput('');

  const 로그인하기 = async () => {
    await axios
      .post('http://localhost:4000/login', { id, password })
      .then((response) => {
        if (response.data.message) {
          alert(response.data.message);
        }

        if (response.data.code === 'success') {
          f7router.navigate('/');
        }
      });
  };

  return (
    <Page name="home">
      <div className="contentContainer">
        <div className="contentInner">
          <div className="inner">
            <div className="headMessage">
              <h2>풋살하고싶을땐</h2>
              <h2 className="hlt">플랩풋볼</h2>
            </div>
            <input
              type="text"
              name="id"
              placeholder="아이디"
              onChange={onChangeID}
            />
            <input
              type="password"
              name="pw"
              placeholder="비밀번호"
              onChange={onChangePassword}
            />

            <button type="button" onClick={로그인하기}>
              로그인
            </button>
            <Link href="/join/" className="joinBtn">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Login;
