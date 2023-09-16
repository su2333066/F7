import React, { useEffect, useState, useCallback } from 'react';
import {
  Page,
  Navbar,
  Link,
  NavRight,
  NavLeft,
  Fab,
  Icon,
} from 'framework7-react';
import AdvertisementSwiper from '../components/Swiper/AdvertisementSwiper';
import MatchList from '../components/MatchList/MatchList';
import '../css/home.css';
import axios from 'axios';
import fetcher from '../util/fetcher';
import useSWR from 'swr';
import useInput from '../hooks/useInput';
import { SearchOutlined } from '@ant-design/icons';

const HomePage = ({ f7router }) => {
  const [userData, setUserData] = useState({});
  const [searchKeyword, onChangeSearchKeyword, setSearchKeyword] = useInput('');
  const [searchData, setSearchData] = useState([]);

  const onKeywordSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchKeyword.length < 2) {
        alert('두 글자이상 입력해주세요');
      } else {
        axios
          .post('http://localhost:4000/search', { searchKeyword })
          .then((response) => {
            if (Object.keys(response.data).length === 2) {
              alert(response.data.message);
            } else if (response.data.searchedMatch.length === 0) {
              alert('검색결과가 없습니다');
              setSearchKeyword('');
            } else {
              alert(
                `${response.data.searchedMatch.length}개의 매치를 찾았습니다`
              );
              setSearchKeyword('');
              setSearchData(response.data.searchedMatch);
            }
          });
      }
    },
    [searchKeyword]
  );

  const 로그아웃 = async () => {
    await axios.post('http://localhost:4000/logout').then((res) => {
      alert(res.data);
      f7router.navigate('/', {
        reloadCurrent: true,
        ignoreCache: true,
      });
    });
  };

  const 자동로그인 = async () => {
    await axios({
      url: 'http://localhost:4000/users',
      method: 'GET',
    }).then((response) => {
      setUserData(response.data);
    });
  };

  useEffect(() => {
    자동로그인();
  }, []);

  return (
    <Page name="home">
      <Navbar className="theme_bg">
        <NavLeft>
          <Link reloadCurrent href="/">
            <img
              src="https://plab-football.s3.amazonaws.com/static/img/logo.svg"
              alt="로고"
            />
          </Link>
        </NavLeft>

        <NavRight>
          <div className="navRight_wrap">
            <div className="navSearch">
              <input
                type="search"
                value={searchKeyword}
                autoComplete="off"
                placeholder="지역, 구장 이름으로 찾기"
                onChange={onChangeSearchKeyword}
              />
              <div className="icon" onClick={onKeywordSearch}>
                <SearchOutlined />
              </div>
            </div>
          </div>
          {Object.keys(userData).length > 0 && (
            <Link className="logout" onClick={로그아웃}>
              로그아웃
            </Link>
          )}
        </NavRight>
      </Navbar>

      <AdvertisementSwiper />

      <MatchList searchData={searchData} />

      <Fab
        href={Object.keys(userData).length === 0 ? '/login/' : '/match/'}
        position="right-bottom"
        slot="fixed"
      >
        <Icon ios="f7:plus" md="material:add" />
      </Fab>
    </Page>
  );
};
export default HomePage;
