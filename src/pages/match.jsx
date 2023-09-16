import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import levelType from '../util/levelType';
import useInput from '../hooks/useInput';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/reset.css';
import fetcher from '../util/fetcher';
import useSWR from 'swr';
import { Fab, Icon, Link, List, ListItem, Page } from 'framework7-react';

function Match({ f7router, f7route }) {
  const { seq } = f7route.params;

  const [place, onChangePlace] = useInput('');
  const [address, onChangeAddress] = useInput('');
  const [level, onChangeLevel] = useInput(1);
  const [time, onChangeTime] = useInput('');
  const [memo, onChangeMemo] = useInput('');

  const addMatch = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post('http://localhost:4000/match', {
          place,
          address,
          time,
          memo,
          level,
        })
        .then((response) => {
          if (response.data.code === 'success') {
            alert(response.data.message);
            f7router.navigate('/', {
              reloadCurrent: true,
              ignoreCache: true,
            });
          }
        });
    },
    [place, address, time, memo, level]
  );

  const modifyMatch = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post(`http://localhost:4000/match/${seq}`, {
          place,
          address,
          time,
          memo,
          level,
        })
        .then((response) => {
          if (response.data.code === 'success') {
            alert(response.data.message);
            f7router.navigate('/', {
              reloadCurrent: true,
              ignoreCache: true,
            });
          }
        });
    },
    [place, address, time, memo, level, seq]
  );

  return (
    <Page>
      <div className="contentContainer">
        <div className="contentInner">
          <div className="inner">
            <div className="headMessage">
              <h2>풋살하고싶을땐</h2>
              <Link className="back" back>
                <Icon
                  ios="f7:arrow_uturn_left_circle_fill"
                  md="material:arrow_uturn_left_circle_fill"
                />
              </Link>
              <h2 className="hlt">플랩풋볼</h2>
            </div>
            <h5>장소</h5>
            <input name="place" onChange={onChangePlace}></input>
            <h5>주소</h5>
            <input name="address" onChange={onChangeAddress}></input>
            <h5>레벨</h5>
            <div className="level">
              {levelType.map((item, index) => {
                const className = level == item.value ? 'button-active' : '';

                return (
                  <button
                    name="level"
                    type="radio"
                    className={className}
                    key={`levelButtons-${index}`}
                    value={item.value}
                    onClick={onChangeLevel}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
            <h5>경기날짜</h5>
            <input
              className="date"
              type="datetime-local"
              name="time"
              onChange={onChangeTime}
            ></input>
            <h5>메모</h5>
            <input name="memo" onChange={onChangeMemo}></input>

            {seq !== undefined ? (
              <button type="button" onClick={modifyMatch}>
                매치수정
              </button>
            ) : (
              <button type="button" onClick={addMatch}>
                매치등록
              </button>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}

export default Match;
