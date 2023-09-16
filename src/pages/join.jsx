import { Link, Page } from 'framework7-react';
import '../css/login.css';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import levelType from '../util/levelType';
import useInput from '../hooks/useInput';

const Join = ({ f7router }) => {
  const [id, onChangeID] = useInput('');
  const [name, onChangeName] = useInput('');
  const [level, onChangeLevel] = useInput(1);
  const [password, , setPassword] = useInput('');
  const [passwordCheck, , setPasswordCheck] = useInput('');
  const [mismatchError, setMismatchError] = useState(false);

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck]
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password]
  );

  const onSignUp = async () => {
    await axios
      .post('http://localhost:4000/join', { id, name, level, password })
      .then((response) => {
        if (response.data.message) {
          alert(response.data.message);
        }

        if (response.data.code === 'success') {
          f7router.navigate('/login/');
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
              type="text"
              name="name"
              placeholder="이름을 입력해주세요"
              onChange={onChangeName}
            />
            <span className="levelCheck">레벨을 선택해주세요</span>
            <div className="level">
              {levelType.map((item, index) => {
                const className = level == item.value ? 'button-active' : '';
                return (
                  <button
                    name="level"
                    type="radio"
                    className={className}
                    key={`level-${index}`}
                    value={item.value}
                    onClick={onChangeLevel}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={onChangePassword}
            />
            <input
              type="password"
              id="password-check"
              name="password-check"
              placeholder="비밀번호를 확인해주세요"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
            <button type="button" onClick={onSignUp}>
              회원가입
            </button>
            <Link className="joinBtn" href="/login/">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Join;
