const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mysql = require('mysql2');
const port = 4000;
const app = express();
const db = mysql.createPoolCluster();
const cron = require('node-cron');

app.use(express.json());
app.use(
  session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(
  cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

db.add('portfolio', {
  host: 'localhost',
  user: 'root',
  password: '@keasoo30',
  database: 'portfolio',
  port: 3306,
});

function 디비실행(query) {
  return new Promise(function (resolve, reject) {
    db.getConnection('portfolio', function (error, connection) {
      if (error) {
        console.log('디비 연결 오류', error);
        reject(true);
      }

      connection.query(query, function (error, data) {
        if (error) {
          console.log('쿼리 오류', error);
          reject(true);
        }

        resolve(data);
      });

      connection.release();
    });
  });
}

let loginUser = {};

app.get('/users', (req, res) => {
  res.json(loginUser || false);
});

app.post('/login', async (req, res) => {
  const { id, password } = req.body;

  const result = {
    code: 'success',
    message: '로그인 되었습니다',
    login: false,
  };

  if (id === '') {
    result.code = 'fail';
    result.message = '아이디 또는 비밀번호를 입력해주세요';
    res.send(result);
    return;
  }

  if (password === '') {
    result.code = 'fail';
    result.message = '아이디 또는 비밀번호를 입력해주세요';
    res.send(result);
    return;
  }

  const user = await 디비실행(
    `SELECT * FROM user WHERE id='${id}' AND password = '${password}'`
  );

  const userID = await 디비실행(`SELECT * FROM user WHERE id='${id}'`);

  if (user.length === 0) {
    result.code = 'fail';
    result.message = '비밀번호를 다시 입력해주세요';
  }

  if (userID.length === 0) {
    result.code = 'fail';
    result.message = '사용자가 존재하지 않습니다';
  }

  if (result.code === 'fail') {
    res.send(result);
    return;
  }

  loginUser = user[0];
  // req.session.save();
  result.login = loginUser;

  res.send(result);
});

app.post('/logout', (req, res) => {
  // req.session.destroy();
  loginUser = {};
  res.send('로그아웃 되었습니다');
});

app.post('/join', async (req, res) => {
  const { id, name, level, password } = req.body;

  const result = {
    code: 'success',
    message: '회원가입 되었습니다',
  };

  if (id === '') {
    result.code = 'fail';
    result.message = '아이디를 입력해주세요';
  }

  if (password === '') {
    result.code = 'fail';
    result.message = '비밀번호를 입력해주세요';
  }

  const user = await 디비실행(`SELECT * FROM user WHERE id='${id}'`);

  if (user.length > 0) {
    result.code = 'fail';
    result.message = '이미 동일한 아이디가 존재합니다';
  }

  if (result.code === 'fail') {
    res.send(result);
    return;
  }

  await 디비실행(
    `INSERT INTO user(id,password,name,level) VALUES('${id}','${password}','${name}','${level}')`
  );

  res.send(result);
});

app.get('/match', async (req, res) => {
  if (loginUser === undefined) {
    return;
  }

  const query = `SELECT *, DATEDIFF(matchtime, NOW()) AS date_diff FROM matching ORDER BY matchtime DESC;`;
  const matchList = await 디비실행(query);

  res.send(matchList);
});

app.post('/match', async (req, res) => {
  const { place, address, time, memo, level } = req.body;

  const result = {
    code: 'success',
    message: '매치가 등록 되었습니다',
  };

  if (
    place === '' ||
    address === '' ||
    time === '' ||
    memo === '' ||
    level === ''
  ) {
    result.code = 'fail';
    result.message = '모두 작성해주세요';
  }

  if (result.code === 'fail') {
    res.send(result);
    return;
  }

  await 디비실행(
    `INSERT INTO matching(place,link,matchtime,memo,level,user_seq) VALUES('${place}','${address}','${time}','${memo}','${level}','${loginUser.seq}')`
  );

  res.send(result);
});

app.post('/match/apply', async (req, res) => {
  const { seq } = req.body;

  const {
    loginUser: { seq: loginUserSeq = '1' },
  } = req.session;

  const result = {
    code: 'success',
    message: '신청되었습니다',
  };

  let [{ attend_user_seq = '' }] = await 디비실행(
    `SELECT * FROM matching WHERE seq = '${seq}'`
  );

  if (attend_user_seq !== '') {
    const 참여자번호 = attend_user_seq
      .split('/')
      .filter((item) => {
        return item !== '';
      })
      .join(',');

    if (참여자번호.includes(loginUserSeq)) {
      result.code = 'fail';
      result.message = '이미 신청하였습니다';
      res.send(result);
      return;
    }
  }

  let new_attend_user_seq = `${attend_user_seq}${loginUserSeq}/`;

  const query = `UPDATE matching SET attend_user_seq='${new_attend_user_seq}' WHERE seq='${seq}'`;

  await 디비실행(query);
  const data = await 디비실행(`SELECT * FROM matching WHERE seq = '${seq}'`);

  result.attend = data[0];

  res.send(result);
});

app.post('/match/cancel', async (req, res) => {
  const { seq } = req.body;

  const {
    loginUser: { seq: loginUserSeq = '1' },
  } = req.session;

  const result = {
    code: 'success',
    message: '취소되었습니다',
  };

  let [{ attend_user_seq = '' }] = await 디비실행(
    `SELECT * FROM matching WHERE seq = '${seq}'`
  );

  let attendData = attend_user_seq.split('/');
  attendData.pop();
  let newAttendData = '';

  attendData.map((attendUserSeq) => {
    if (Number(attendUserSeq) !== loginUserSeq) {
      newAttendData += attendUserSeq + '/';
    }
  });

  const query = `UPDATE matching SET attend_user_seq='${newAttendData}' WHERE seq='${seq}'`;

  await 디비실행(query);
  const data = await 디비실행(`SELECT * FROM matching WHERE seq = '${seq}'`);

  result.attend = data[0];

  res.send(result);
});

app.post('/match/delete', async (req, res) => {
  const { seq, loginUserSeq } = req.body;

  const result = {
    code: 'success',
    message: '삭제되었습니다',
  };

  await 디비실행(
    `DELETE FROM matching WHERE user_seq = '${loginUserSeq}' AND seq='${seq}'`
  );

  res.send(result);
});

app.post('/match/:seq', async (req, res) => {
  const seq = req.params.seq;
  const { place, address, time, memo, level } = req.body;

  const result = {
    code: 'success',
    message: '수정되었습니다',
  };

  await 디비실행(
    `UPDATE matching SET place = '${place}' , link = '${address}', memo = '${memo}', level = '${level}', matchtime = '${time}' WHERE seq = ${seq};`
  );

  res.send(result);
});

app.get('/detail/:seq', async (req, res) => {
  const seq = req.params.seq;
  const data = await 디비실행(`SELECT * FROM matching WHERE seq = '${seq}'`);

  res.send(data[0]);
});

app.post('/search', async (req, res) => {
  const result = {
    code: 'success',
    message: '검색을 완료했습니다',
  };

  let { searchKeyword } = req.body;

  searchKeyword = searchKeyword.trim();

  let special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;

  if (special_pattern.test(searchKeyword) == true) {
    result.code = 'fail';
    result.message = '특수문자 또는 공백이 입력되었습니다.';
    res.send(result);
    return;
  }

  const query = `SELECT *, DATEDIFF(matchtime, NOW()) AS date_diff FROM matching WHERE regexp_like(place, '${searchKeyword}') ORDER BY matchtime DESC`;

  const searchedMatch = await 디비실행(query);
  result.searchedMatch = searchedMatch;

  res.send(result);
});

// 0 0 */6 * * * -> 6시간 마다
cron.schedule('0 0 */6 * * *', async function () {
  console.log('6시간 마다 작업 실행');

  // 마감매칭목록 매칭
  const 자동매치목록 = await 디비실행(
    `SELECT * FROM matching WHERE matchtry = 'NO' AND attend_user_seq != ''`
  );

  if (자동매치목록.length === 0) {
    return;
  }

  for (let key in 자동매치목록) {
    const 자동매치값 = 자동매치목록[key];
    const 방레벨 = 자동매치값.level;
    const 방번호 = 자동매치값.seq;

    const 참여자번호 = 자동매치값.attend_user_seq
      .split('/')
      .filter((item) => {
        return item !== '';
      })
      .join("','");

    const 참여자들 = await 디비실행(
      `SELECT * FROM user WHERE seq IN ('${참여자번호}')`
    );

    let 최솟값 = Number.MAX_SAFE_INTEGER;
    let 최종선택자 = {};

    참여자들.forEach((item) => {
      const 근사값 = Math.abs(방레벨 - item.level);

      if (근사값 < 최솟값) {
        최솟값 = 근사값;
        최종선택자 = item;
      }
    });

    const 최종선택자유저번호 = 최종선택자.seq;

    console.log(최종선택자유저번호);

    const query = `UPDATE matching SET match_user_seq='${최종선택자유저번호}' WHERE seq='${방번호}'`;
    await 디비실행(query);
  }
});

// 0 0 */1 * * * -> 1시간 마다
cron.schedule('0 0 */1 * * *', async function () {
  console.log('1시간 마다 작업 실행 :', new Date().toString());

  // 매칭 하루전 마감매칭목록으로 변경
  const 마감매칭목록 = await 디비실행(
    `SELECT * , DATEDIFF(matchtime, NOW()) as date_diff FROM matching WHERE DATEDIFF(matchtime, NOW()) < 2`
  );

  if (마감매칭목록.length === 0) {
    return;
  }

  for (let key in 마감매칭목록) {
    const 마감매칭값 = 마감매칭목록[key];

    let matchtry = 'DEL';

    if (마감매칭값.date_diff === 1) {
      matchtry = 'NO';
    }

    const query = `UPDATE matching SET matchtry='${matchtry}' WHERE seq='${마감매칭값.seq}'`;

    await 디비실행(query);
  }
});

app.listen(port, () => {
  console.log('서버가 실행되었습니다');
});
