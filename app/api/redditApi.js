/**
 * Created by owenchen on 16-09-18.
 */

var request = require('request');


module.exports = function () {

    var TYPE = "reddit";

    var getJsonByUrl = function getJsonByUrl(url, callback) {
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


        for(i = 0; i < 5; i++) {
            children.push(populateNode(parsed.data.children[i], 1));
        }
        //parsed.data.children.forEach(function(child){
        //    children.push(populateNode(child, 1));
        //});

        root.children = children;
        callback(root);
    }

    return {
        getJsonByUrl : getJsonByUrl
    }

    function populateNode(raw, depth) {
        var node = {text: "", score: "", author: "", time: "", num_children: "", id: "", children: []};
        var data = raw.data;

        node.text = data.title;
        node.score = data.score;
        node.author = data.author;
        node.time = data.created;
        node.num_children = data.num_comments;
        node.id = data.id;

        return node;
    }
}
