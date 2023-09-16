import React, { useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Location from '../util/Location';
import { CopyToClipboard } from 'react-copy-to-clipboard/src';
import useSWR from 'swr';
import fetcher from '../util/fetcher';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import '../css/detail.css';
import { Link, NavLeft, NavRight, Navbar, Page } from 'framework7-react';

function Detail({ f7router, f7route }) {
  const { seq } = f7route.params;

  const { data: userData } = useSWR('http://localhost:4000/users', fetcher);
  const { data: detailData, mutate } = useSWR(
    `http://localhost:4000/detail/${seq}`,
    fetcher
  );

  console.log(userData, detailData);

  const 신청하기 = useCallback(() => {
    axios
      .post('http://localhost:4000/match/apply', {
        seq: seq,
      })
      .then((response) => {
        alert(response.data.message);
        if (response.data.code === 'success') {
          mutate(response.data.attend, false);
        }
      });
  }, [seq]);

  const 취소하기 = useCallback(() => {
    axios
      .post('http://localhost:4000/match/cancel', {
        seq: seq,
      })
      .then((response) => {
        alert(response.data.message);
        mutate(response.data.attend, false);
      });
  }, [seq]);

  const 삭제하기 = () => {
    axios
      .post('http://localhost:4000/match/delete', {
        seq: seq,
        loginUserSeq: userData.seq,
      })
      .then((response) => {
        alert(response.data.message);
        f7router.navigate('/', {
          reloadCurrent: true,
          ignoreCache: true,
        });
      });
  };

  const 수정하기 = () => {
    f7router.navigate(`/match/${seq}/`);
  };

  const 로그아웃 = async () => {
    await axios.post('http://localhost:4000/logout').then((res) => {
      alert(res.data);
      f7router.navigate('/', {
        reloadCurrent: true,
        ignoreCache: true,
      });
    });
  };

  return (
    <Page>
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
          {Object.keys(userData).length > 0 && (
            <Link className="logout" onClick={로그아웃}>
              로그아웃
            </Link>
          )}
        </NavRight>
      </Navbar>

      <Location link={detailData?.link} />

      <div className="detail_match_point_wrap">
        <h3 className="header">매치 포인트</h3>
        <ul>
          <li>
            <img
              src="https://plab-football.s3.amazonaws.com/static/img/ic_info_level.svg"
              alt="레벨"
            ></img>
            <div>
              <p>모든 레벨 신청가능!</p>
            </div>
          </li>
          <li>
            <img
              src="https://plab-football.s3.amazonaws.com/static/img/ic_info_gender.svg"
              alt="성별"
            ></img>
            <div>
              <p>상관없음</p>
            </div>
          </li>
          <li>
            <img
              src="https://plab-football.s3.amazonaws.com/static/img/ic_info_stadium.svg"
              alt="스타디움"
            ></img>
            <div>
              <p>6vs6 (18명일 경우 3파전)</p>
            </div>
          </li>
          <li>
            <img
              src="https://plab-football.s3.amazonaws.com/static/img/ic_info_max_player_cnt.svg"
              alt="최대인원"
            ></img>
            <div>
              <p>12~18명</p>
            </div>
          </li>
          <li>
            <img
              src="https://plab-football.s3.amazonaws.com/static/img/ic_info_shoes.svg"
              alt="신발"
            ></img>
            <div>
              <p>풋살화/운동화</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="detail_info_wrap">
        <h3 className="header">매치 정보</h3>
        <span>{dayjs(detailData?.matchtime).format('YYYY-MM-DD HH:mm')}</span>
        <span>{detailData?.place}</span>
        <span>{detailData?.link}</span>
        <CopyToClipboard
          text={`${detailData?.link}`}
          onCopy={() => alert('주소가 복사되었습니다')}
          className="copy"
        >
          <span>주소복사</span>
        </CopyToClipboard>
      </div>

      <div className="detail_btn_wrap">
        {detailData?.match_user_seq === userData.seq ? (
          <Link className="chat">채팅</Link>
        ) : detailData?.user_seq === userData.seq ? (
          <>
            <Link onClick={수정하기} className="modify">
              수정
            </Link>
            <Link onClick={삭제하기} className="delete">
              삭제
            </Link>
          </>
        ) : !detailData?.attend_user_seq
            .split('/')
            .map(Number)
            .includes(userData.seq) ? (
          <Link onClick={신청하기} className="apply">
            신청
          </Link>
        ) : (
          <Link onClick={취소하기} className="cancel">
            취소
          </Link>
        )}
      </div>
    </Page>
  );
}

export default Detail;
