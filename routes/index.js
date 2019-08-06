const
    express = require('express') ,
    multer = require('multer'),
    foodyModel = require('../models/foodyModel'),
    router = express.Router();

const imagePath = '/Users/ginggingi/nodejsStudy/foody/public/images';

/* etc. */
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => { cb(null, imagePath); },
      filename: (req, file, cb) => { cb(null, new Date().valueOf() + ".png") },
    })
  });

/* GET home page. */

  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Foody' });
  });

  router.get('/get', (req, res) => {
    const lat = req.query.lat, lng = req.query.lng;
    const LatLng = [lat, lng];
    const distance = req.query.distance;

    console.log('latitude : ' + lat);
    console.log('longitude: ' + lng);
    console.log('distance : ' + distance);
    console.log('===========================');

    foodyModel.findAsDistance(LatLng[0], LatLng[1], distance)
        .then(it => {
          console.log(it);
          res.send(it); })
        .catch(e => console.error(e));
  });

  router.get('/getSingle', (req, res) => {
    const lat = req.query.lat, lng = req.query.lng;
    const LatLng = [lat, lng];
    const distance = req.query.distance;

    console.log('lat : ' + lat);
    console.log('lng: ' + lng);
    console.log('dis : ' + distance);
    console.log('===========================');

    foodyModel.findOneAsDistance(LatLng[0], LatLng[1], distance)
        .then(it => {
          console.log(it[0]);
          res.send(it[0]);})
        .catch(e => console.error(e));
  });

  router.post('/set', upload.array('img', 10), (req, res) => {
    //이미지
    const Files = req.files;
    //데이터
    const Title = req.body.title;
    const Class = req.body.class;
    const MainMenu = req.body.mainmenu;
    const AveragePrice = req.body.averageprice;
    //좌표
    const lat = req.body.lat, lng = req.body.lng;
    const LatLng = [lat, lng];
    //이미지 저장후 리스트화
    var FileArray = [];
    Files.forEach((file) => { FileArray.push(file.filename); });

    var item = {
      Title: Title,
      Class: Class,
      MainMenu: MainMenu,
      AveragePrice: AveragePrice,
      location: { type: 'Point', coordinates: [ LatLng[1], LatLng[0] ] },
      images: FileArray
    };

    foodyModel.create(item)
        .then(it => console.log(it))
        .catch(e => console.error(e));

    return res.send("data sended");
  });

  function valueTest() {
    //데이터 체크 및 테스트
    console.log("Title : " + Title);
    console.log("Class : " + Class);
    console.log("MainMenu : " + MainMenu);
    console.log("AveragePrice : " + AveragePrice);
    console.log("LayLng : " + LatLng[0] + " , " + LatLng[1]);
    console.log("images : [ " + FileArray.toString() + " ]");
  }

module.exports = router;
