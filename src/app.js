const express = require("express");
const serverless = require("serverless-http");
const app = express();
const csp = require('helmet-csp');
const PostHandler = require('./api/models/PostsHandler');
const postHandler = new PostHandler();
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${getImgExt(file.mimetype)}`)
    }
})

const getImgExt = (mimetype) => {
    switch(mimetype){
        case "image/png":
            return ".png";
        case "image/jpeg":
            return '.jpeg';
        case "image/jpg":
            return ".jpg";
    }
}

var upload = multer({ storage: storage })

const router = express.Router();

app.use('/.netlify/functions/app', router);

app.use(csp({
    directives: {
        defaultSrc: ['self']
    }
}))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    next();
})

app.use(express.json());

app.use('/uploads', express.static('uploads'));

router.get('/', (req, res) => {
    res.json({
        'hey': 'this works'
    })
});

router.get("/api/posts", (req, res) => {
    res.status(200).send(postHandler.getData());
});

router.get("/api/posts/:post_id", (req, res) => {
    let postId = req.params.post_id;
    let foundPost = postHandler.getIndividualBlog(postId);
    if (foundPost) {
        res.status(200).send(foundPost);
    } else {
        res.status(404).send('Post not found :(');
    }

});

router.post("/api/posts/", upload.single('post_image'), (req, res) => {
    console.log(req.file);
    const newPost = {
        'id': `${Date.now()}`,
        'title': req.body.title,
        'content': req.body.content,
        'post_image': `uploads/${req.file.filename}`,
        'added_date': `${Date.now()}`,
    }

    postHandler.addPost(newPost);

    res.status(201).send(newPost);
})

module.exports.handler = serverless(app);