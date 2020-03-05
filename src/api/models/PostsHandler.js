const DATA_PATH = "../../data.json";
var data = require("../../data.json");
const fs = require('fs');

class PostsHandler {
    getData() {
        // Get list of posts
        return data;
    }

    getIndividualBlog(id){
        let posts = this.readData();
        return posts.find((item) => {
            return item.id == id;
        })

    }

    addPost(newPost){
        let currentPosts = this.readData();
        currentPosts.unshift(newPost);
        this.storeData(currentPosts);
    }

    readData(){
        return data = require("../../data.json");
    }

    storeData(rawData){
        let data_json = JSON.stringify(rawData);
        fs.writeFileSync(DATA_PATH, data_json);
    }
}

module.exports = PostsHandler;