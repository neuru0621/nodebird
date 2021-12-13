const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
// middlewares.js에서 구현된 isLoggedIn과 isNotLoggedIn을 가져옴
const { Post, User, Hashtag } = require('../models');
// 현재 폴더의 바깥으로 나가서 models 폴더를 찾은 후 그 안에서 
// const Post = require('./post');, 
// const User = require('./user');, 
// const Hashtag = require('./hashtag');을 가져옴

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user ? req.user.Followers.length : 0;
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
    next();
});

router.get('/profile', isLoggedIn, (req, res) => {
    console.log("routes/page.js : 프로파일로 이동하였음");
    res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
    // join.html이 실행되면서 타이틀을 아래와 같이 변경시켜준다.
    console.log("여기야 여기... 여기라구.... : 시작")
    console.log("routes/page.js")
    console.log("여기야 여기... 여기라구.... : 끝")
    console.log("routes/page.js : 회원가입을 위한 곳으로 이동하였음");
    res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', (req, res, next) => {
    const twits = [];
    res.render('main', {
        title: 'NodeBird',
        twits,
    });
});

router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createAt', 'Desc']],
        });
        res.render('main', {
            title: 'NodeBird',
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({ include: [{ model: User }] });
        }

        return res.render('main', {
            title: `$(query} | NodeBird`,
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

module.exports = router;