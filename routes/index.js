const
    express = require('express') ,
    multer = require('multer'),
    foodyModel = require('../models/foodyModel'),
    router = express.Router();

const imagePath = '/Users/ginggingi/nodejsStudy/foody/images';

/* etc. */
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => { cb(null, imagePath); },
      filename: (req, file, cb) => { cb(null, new Date().valueOf() + '_' + file.originalname); },
    })
  });

/* GET home page. */

  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Foody' });
  });

  router.get('/get', (req, res) => {
    const LatLng = req.query.latlng.split(',');
    const distance = req.query.distance;

    foodyModel.findAsDistance(LatLng[0], LatLng[1], distance)
        .then(it => res.send(it))
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
    const LatLng = req.body.latlng.split(',');
    //이미지 저장후 리스트화
    var FileArray = [];
    Files.forEach((file) => { FileArray.push(file.originalname); });

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
