
var request = require('request');

module.exports = function () {

    var TYPE = "reddit";

    var getRequestUrl = function getRequestUrl(request) {
        var params = request.split(" ");

        switch (params[0].toLowerCase()) {
            case 'subreddit':
                var url = "http://reddit.com/r/{subreddit}.json";
                url = url.replace("{subreddit}",params[1]);
                break;
            case 'comments':
                var url = "http://reddit.com/r/{subreddit}/comments/{commentid}.json";
                url = url.replace("{commentid}",params[2]);
                url = url.replace("{subreddit}",params[1]);
                break;
        }

        return url;
    }

    var getJsonByUrl = function getJsonByUrl(subreddit, callback) {
        var url = getRequestUrl(subreddit);

        request(url, function (error, res, body) {
            if (error) {
                console.log(error);
            }

            parseJson(body, callback);
        });
    }

    /**
     * Parse the raw json for the important information
     */
    function parseJson(raw, callback) {
        var root = {type: "", children: []};
        var parsed = JSON.parse(raw);
        var children = [];
        root.type = TYPE;
        parsed = parsed[parsed.length - 1];

        for(i = 0; i < 5; i++) {
            children.push(populateNode(parsed.data.children[i], 1));
        }

        root.children = children;
        callback(root);
    }

    return {
        getJsonByUrl : getJsonByUrl
    }

    function populateNode(raw, depth) {
        var node = {
            text: "",
            score: "",
            author: "",
            time: "",
            num_children: "",
            id: "",
            children: []
        };

        var data = raw.data;

        node.score = data.score;
        node.author = data.author;
        node.time = data.created;
        node.id = data.id;

        //Handle comments and posts differently
        switch (raw.kind) {
            case 't1':
                node.text = data.body;
                if(data.replies == ""){
                    node.num_children = "0";
                }
                else{
                    node.num_children = data.replies.data.children.length;
                }

                break ;
            case 't3':
                node.text = data.title;
                node.num_children = data.num_comments;
                break;
        }

        return node;
    }
}
