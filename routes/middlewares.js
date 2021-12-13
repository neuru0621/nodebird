exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        // passport 객체를 사용함으로써 req객체에 isAuthenticated()메서드가 추가됨
        // 사용자가 로그인 상태이면 이 메서드는 True를 리턴하고 로그아웃 된 상태이면 False를 리턴함
        // 로그인 된 상태이므로 next() 메서드를 호출함
        console.log("routes/middlewares.js : 로그인 상태입니다.")
        next();
        // next()가 실행되면 page.js의 router.get('/profile', isLoggedIn,... 에서 profile.html 페이지가 실행된다.
    } else {
        // 로그인 되지 않은 상태이므로 웹브라우저에 403에러와 함께 '로그인 필요'라는 메시지를 표시하게 된다.
        // 로그인 되지 않은 경우에 대한 이벤트를 여기에서 추가 구현하도록 한다.
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    // 사용자 로그인이 되지 않은 상태에서
    if (!req.isAuthenticated()) {
        // 회원가입을 클릭하는 경우 이곳이 처리하게 됨
        // 사용자가 로그인 되지 않은 상태인 경우에는 next() 메서드 호출
        next();
        // next()가 실행되면 page.js의 router.get('/join', isNotLoggedIn,... 에서 join.html 페이지가 실행된다.
    } else {
        // 사용자가 로그인 된 상태인 경우에는 '로그인한 상태입니다'라는 메시지와 함께 메인 페이지로 리디렉트 시킨다.
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};