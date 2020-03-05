const express = require("express");
const serverless = require("serverless-http");
const app = express();
const csp = require('helmet-csp');
const PostHandler = require('./api/models/PostsHandler');
const postHandler = new PostHandler();
var multer = require('multer');

var data = [
    {
        "id": "1583220351214",
        "title": "Building Progressive Mobile Apps",
        "content": "Progressive web apps use modern web APIs along with traditional progressive enhancement strategy to create cross-platform web applications. These apps work everywhere and provide several features that give them the same user experience advantages as native apps. This set of docs tells you all you need to know about them.\n\nPWAs should be discoverable, installable, linkable, network independent, progressive, re-engageable, responsive, and safe. To find out more about what these mean, read Progressive web app advantages.\n\nGoogle uses a helpful acronym for us to understand why PWAs are so effective: FIRE – Fast, Integrated, Reliable, and Engaging. This acronym is itself a perfect explanation of why PWA is in trend amongst developers.",
        "post_image": "uploads/post_image-1583220348369.jpeg",
        "added_date": "1583220351214"
    },
    {
        "id": "1581377760891",
        "title": "My first job as a developer",
        "content": "In college, I met a friend at a computer club who was showing a really cool application where you can swipe between different types of clothing!\nBeing very intrigued, I asked my friend if there is any way I can help out and join the team! After some thinking, he told me to finish an assignment, and then they will consider me. Over the weekend, I finished the assignment and was right away told I can join the team, though I would be working for free. That was completely fine for me! ",
        "post_image": "uploads/post-image-1581377760883.jpg",
        "added_date": "1581377760891"
    }
]

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

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    next();
})

app.use(express.json());

app.use('/uploads', express.static('uploads'));

router.get('/', (req, res) => {
    res.json(postHandler.getData());
});

router.get("/api/posts", (req, res) => {
    res.json(postHandler.getData());
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