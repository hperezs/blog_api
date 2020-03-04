const DATA_PATH = "./data.json";
const fs = require('fs');

class PostsHandler {
    getData() {
        // Get list of posts
        return this.readData();
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
        console.log('\n *READING JSON FILE* \n');
        var data = fs.readFileSync(DATA_PATH);
        var data_JSON = JSON.parse(data);
        return data_JSON;
    }

    storeData(rawData){
        let data = JSON.stringify(rawData);
        fs.writeFileSync(DATA_PATH, data);
    }
}

module.exports = PostsHandler;