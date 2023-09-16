import './MatchList.css';
import useSWR from 'swr';
import fetcher from '../../util/fetcher';
import levelType from '../../util/levelType';
import dayjs from 'dayjs';
import { List, ListItem } from 'framework7-react';
import { useEffect } from 'react';

const getDayOfWeek = (day) => {
  // 0 => 일요일
  // 1 => 월
  // 6 => 토요일

  //ex) getDayOfWeek(0) -> '일'
  const week = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = week[day];
  return dayOfWeek;
};

const MatchList = ({ searchData }) => {
  const { data: userData } = useSWR('http://localhost:4000/users', fetcher);
  const { data: matchData } = useSWR('http://localhost:4000/match', fetcher);

  return (
    <List dividersIos mediaList outlineIos strongIos>
      {searchData.length === 0
        ? matchData &&
          Object.values(matchData).map((item, index) => {
            const convertDay = getDayOfWeek(dayjs(item.matchtime).format('d'));
            return (
              <ListItem
                key={index}
                link={
                  Object.keys(userData).length === 0
                    ? '/login/'
                    : `/detail/${item.seq}/`
                }
                title={dayjs(item.matchtime).format(
                  `YYYY-MM-DD (${convertDay}) ${dayjs(item.matchtime).format(
                    `HH:mm`
                  )}`
                )}
                subtitle={item.place}
                text={
                  item.user_seq === userData.seq
                    ? '내가만든방'
                    : parseInt(item.date_diff) < 1
                    ? item.match_user_seq === userData.seq
                      ? '매치 성공!'
                      : '마감'
                    : item.attend_user_seq
                        .split('/')
                        .includes(String(userData.seq))
                    ? '신청완료'
                    : '신청가능'
                }
              >
                {levelType.map((type, index) => {
                  if (type.value === item.level) {
                    return (
                      <div
                        key={index}
                        slot="media"
                        className={`level_type level_${item.level}`}
                      >
                        {type.name}
                      </div>
                    );
                  }
                })}
              </ListItem>
            );
          })
        : searchData &&
          Object.values(searchData).map((item, index) => {
            const convertDay = getDayOfWeek(dayjs(item.matchtime).format('d'));
            return (
              <ListItem
                key={index}
                link={`/detail/${item.seq}/`}
                title={dayjs(item.matchtime).format(
                  `YYYY-MM-DD (${convertDay}) HH:mm`
                )}
                subtitle={item.place}
                text={
                  item.user_seq === userData.seq
                    ? '내가만든방'
                    : parseInt(item.date_diff) < 1
                    ? item.match_user_seq !== null
                      ? '매치 성공!'
                      : '마감'
                    : item.attend_user_seq
                        .split('/')
                        .includes(String(userData.seq))
                    ? '신청완료'
                    : '신청가능'
                }
              >
                {levelType.map((type, index) => {
                  if (type.value === item.level) {
                    return (
                      <div
                        key={index}
                        slot="media"
                        className={`level_type level_${item.level}`}
                      >
                        {type.name}
                      </div>
                    );
                  }
                })}
              </ListItem>
            );
          })}
    </List>
  );
};

export default MatchList;
