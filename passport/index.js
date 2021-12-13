// 회원가입과 로그인시 세텬과 쿠키처리 등 복잡한 작업을 처리하는 모듈임
// 로컬 로그인 및 SNS로그인을 passport로 처리할 수 있다.
// 설치 : npm i passport passport-local passport-kakao bcrypt
// 설치 후에는 passport를 app.js와 연결해 주어야 한다.
// app.js에 
// const passport = require('passport');
// const passportConfig = require('./passport');
// passportConfig();
// app.use(passport.initialize());
// app.use(passport.session());
// 위의 다섯 줄을 적절한 위치에 삽입해 주면 passport가 app.js와 연결이 완료된다.
// app.js를 확인해 보세요
// 이 객체는 서버가 시작되면 반드시 실행된다.
// front에서 refresh가 발생하는 경우에는 실행되지 않는다.
//
// passport 객체의 로그인 전체 실행과정은 아래와 같다.
// 1. 라우터를 통해 로그인 요청이 들어옴
// 2. 라우터에서 passport.authenticate 메서드 호출
// 3. 로그인 전략 수행(로컬 로그인 시 : passport/localStrategy.js, 카카오 로그인 시 : passport/kakaoStrategy.js가 관여함)
// 4. 로그인 성공시 사용자 정보 객체와 함께 req.login 호출
// 5. req.login 메서드가 passport.serializeUser 호출
// 6. req.session에 사용자 아이디만 저장
// 7. 로그인 완료
//
// passport 객체의 로그아웃에 대한 전체 실행과정은 아래와 같다.
// 1. 로그아웃 요청이 들어옴
// 2. 라우터에 요청이 도달하기 전에 passport.session 미들웨어가 passport.deserialzeUser 메서드 호출
// 3. req.session에 저장된 아이디로 데이터베이스에서 사용자 조회
// 4. 조회된 사용자 정보를 req.user에 저장
// 5. 라우터에서 req.user 객체 사용 가능
//
const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    // 계정에 로그인을 시도할 때 호출되어 실행된다.
    passport.serializeUser((user, done) => {
        // 로그아웃일때는 실행되지 않는다.
        // req.session()객체에 어떤 데이터를 저장할지 정하는 메서드이다.
        // 매개변수로 user를 받으면 done함수에 user.id를 넘겨준다.
        // user객체의 구조
        // 1. dataValues
        // 1-1. id
        // 1-2. email
        // 1-3. nick
        // 1-4. password
        // 1-5. provider
        // 1-6. snsId
        // 1-7. createdAt
        // 1-8. updatedAt:
        // 1-9. deletedAt:
        // 2. _previousDataValues
        // 3. uniqno
        // 4. _changed
        // 5. _options
        // 6. isNewRecord
        done(null, user.id);
        // done 함수의 첫번째 인수는 에러 발생 시 사용하는 인자이며 두번째 인수는 저장하고 싶은 데이타이다.
        // 이 함수는 세션에 사용자의 모든정보를 저장하는 경우에는 세션의 용량이 커지고 데이터 일관성에 문제가 발생할 수 있으므로 사용자 정보 중 아이디만 저장하도록 제약한 것이다.
        // user.id는 dataValues객체 내에 있지만 user.dataValues.id에서처럼 dataValues를 사용하지 않고 dataValues를 생략하 채 user.id로도 호출이 가능하다.
    });

    passport.deserializeUser((id, done) => {
        // 로그아웃일때도 실행된다.(로그인 시에도 호출됨)
        // 이 메서드는 세션에 저장된 아이디를 통해 사용자 정보 객체를 불러오는 역할을 한다.
        // passport.session 미들웨어가 이 메서드를 호출한다.
        // serializeUser 메서드의 done의 인수 중 두번째 인수가 이 메서드의 첫번째 인수값으로 들어온다.
        User.findOne({ 
            where: { id },
        include: [{
            model: User,
            attributes: ['id', 'nick'],
            as: 'Followers',
        }, {
            model: User,
            attributes: ['id', 'nick'],
            as: 'Followings',
        }], 
    })
        .then(user => done(null, user))
        .catch(err => done(err));
    });

    local();
    kakao();
};