const express = require('express');
const multer = require('multer');       // 파일업로드를 위한 미들웨어 로딩
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();
const uploads_dir = 'uploads';    
// uploads 폴더의 이름을 정의함, 추후 폴더 이름은 변경하거나 또는 db에서 결정하도록 할 수 있음


try {
    fs.readdirSync(uploads_dir);                    
    // uploads폴더를 읽어들여서 존재하지 않는다면 에러를 발생시켜서 catch문으로 이동함, parameter의 문자열은 생성될 폴더의 이름임
    console.log('uploads 폴더가 생성되어 있음을 확인하였습니다.');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync(uploads_dir);                    
    // 업로드되는 이미지 파일이 저장되는 폴더를 생성하는 부분, parameter의 문자열은 생성될 폴더의 이름임
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            // req의 구조
            // req가 담고 있는 데이타를 확인하기 위해서는 console.log(req.구조체이름) 형식으로 콘솔에서 확인할 수 있음
            // 예를 들어서 req.user를 확이해보면 dataValues, _previousDataValues, uniqno, _changed, _options, isNewRecord, Followers, Followings를 확인할 수 있음
            // 개별 하부 구조는 다시 req.user.dataValues와 같은 이름으로 console.log를 이용하여 확인할 수 있음
            // 1. IncomingMessage
            // 2. _events
            // 3. _eventsCount
            // 4. _maxListeners
            // 5. socket
            // 6. httpVersionMajor: 1
            // 7. httpVersionMinor: 1
            // 8. httpVersion: 1.1
            // 9. complete: false
            // 10. rawHeaders
            // 11. rawTrailers
            // 12. aborted
            // 13. upgrade
            // 14. url
            // 15. method
            // 16. statusCode
            // 17. statusMessage
            // 18. client
            // 19. _consuming
            // 20. _dumped
            // 21. next
            // 22. baseUrl
            // 23. originalUrl
            // 24. _parsedUrl
            // 25. params
            // 26. query
            // 27. res
            // 28. _startAt
            // 29. _startTime
            // 30. _remoteAddress
            // 31. body
            // 32. secret
            // 33. cookies
            // 34. signedCookies
            // 35. _parsedOriginalUrl
            // 36. sessionStore
            // 37. sessionID // session
            // 38. logIn
            // 39. login
            // 40. logOut
            // 41. logout
            // 42. isAuthenticated
            // 43. isUnauthenticated
            // 44. _passport
            // 45. user
            // 46. route
            // 47. [Symbol(kCapture)]
            // 48. [Symbol(kHeaders)]
            // 49. [Symbol(kHeadersCount)]
            // 50. [Symbol(kTrailers)]
            // 51. [Symbol(kTrailersCount)]
            // 52. [Symbol(RequestTimeout)]
            cb(null, uploads_dir + '/');      
            // cb(null, uploads_dir); 이렇게 사용해도 됨
            //
            //
            //
            // file은 다음과 같은 형식으로 넘어온다
            // {
            //      fieldname: 'img',
            //      originalname: '20210106-01-1024x512.png',
            //      encoding: '7bit',
            //      mimetype: 'image/png'
            // }
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            // 업로드 되는 파일의 확장자명을 구하여 ext에 저장한다.
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
            // file.originalname : 업로드할 파일의 이름(확장자 포함)
            // path.basename(file.originalname, ext) : file.originalname에서 확장자를 뺀 파일이름만 리턴한다.
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    // 업로드 되는 파일사이즈를 5Mb로 제한한다.
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    // 위의 req 객체의 내용은 위에서 설명한 req의 객체에 file이 하나 더 들어 있음
    // request.file은 아래와 같음
    // fieldname: 'img',
    // originalname: '20210106-01-1024x512.png',
    // encoding: '7bit',
    // mimetype: 'image/png',
    // destination: 'uploads/',
    // filename: '20210106-01-1024x5121639366990828.png',
    // path: 'uploads\\20210106-01-1024x5121639366990828.png',
    // size: 75320
    res.json({ url: `/img/${req.file.filename}` });
    // res의 구조
    // 1. _eventsCount
    // 2. _maxListeners
    // 3. outputData
    // 4. outputSize
    // 5. writable
    // 6. destroyed
    // 7. _last
    // 8. chunkedEncoding
    // 9. shouldKeepAlive
    // 10. maxRequestsOnConnectionReached
    // 11. _defaultKeepAlive
    // 12. useChunkedEncodingByDefault
    // 13. sendDate
    // 14. _removedConnection
    // 15. _removedContLen
    // 16. _removedTE
    // 17. _contentLength
    // 18. _hasBody
    // 19. _trailer
    // 20. finished
    // 21. _headerSent
    // 22. _closed
    // 23. socket
    // 24. _header
    // 25. _keepAliveTimeout
    // 26. _onPendingData
    // 27. req
    // 28. _sent100
    // 29. _expect_continue
    // 30. locals
    // 31. _startAt
    // 32. _startTime
    // 33. writeHead
    // 34. __onFinished
    // 35. end
    // 36. statusCode
    // 37. statusMessage
    // 38. [Symbol(kCapture)]
    // 39. [Symbol(kNeedDrain)]
    // 40. [Symbol(corked)]
    // 41. [Symbol(kOutHeaders)]
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            // content : 텍스트 박스에 입력된 내용
            img: req.body.url,
            // img : 시스템에 의하여 변경된 파일이름(서버에 저장하기 위하여 변경한 파일이름으로서 확장자를 포함한다)
            UserId: req.user.id,
            // UserId : 회원 ID로서 AWS의 nodeBird database에 있는 users테이블의 id값임
        });
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        // hashtags : 텍스트박스에 입력한 문장중에서 #으로 시작하는 해시태그만 추출하여 리스트 형식([,,,])으로 저장되어 있음
        if (hashtags) { // 해시태그가 존재한다면...
            const result = await Promise.all( 
            // promise를 사용함으로써 실행은 바로 하더라도 결과값은 나중에 받는 방식이 된다. 
            // 성공하면 내부적으로 .then이 실행되고 실패하면 내부적으로 .catch가 실행된다. 
            // 혹시라도 발생할 수 있는 콜백지옥(callback hell)현상을 극복할 수 있으므로 반드시 숙지하고 알아두어야 하는 객체이다.
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() },
                        // 기존에 존재하는 해시태그인 경우에는 그 해시태그를 사용하고 그렇지 않으면 새로 생성한다.
                    })
                }),
            );
            // result값은 아래와 같은 객체를 담고 있다.
            // [
            //      [
            //          Hashtag {
            //          dataValues: [Object],
            //          _previousDataValues: [Object],
            //          uniqno: 1,
            //          _changed: Set(0) {},
            //          _options: [Object],
            //          isNewRecord: false
            //          },
            //          true
            //      ]
            // ]
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;