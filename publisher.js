var _ = require('underscore');
var uuid = require('node-uuid');
//change this before execution
//****************************
const PROJECTID = <<projectID>>;
const KEYFILE = <<full path to the key file>>;
//**************************** 
var gcloud = require('gcloud')({
    projectId: PROJECTID,
    keyFilename: KEYFILE
});

var pubsub = gcloud.pubsub();

/**
 * creates a topic, if it doesn't exist
 */
function createTopic(topicName, cb) {
    if (topicExists(topicName, function (exist) {
        if (exist < 0) {
            pubsub.createTopic(topicName, function (error, topic, response) {
                if (error) {
                    console.log(error);
                    process.exit();
                }
                cb(response);
            });

        }
        else {
            console.log("topic \'%s\' already exist", topicName);
            cb();
        }
    }));

}
/**
 * check if a given topic exist based on the name
 * returns true if exist or invalid input
 * returns -1 if it doesn't exist
 */

function topicExists(topicName, cb) {
    if (!topicName) cb(true);
    var namesArray = [];
    getTopics(function (topicsArray) {
        if (!topicsArray) cb(true);

        topicsArray.map(function (topic) {
            var lastIndex = _.lastIndexOf(topic, '/');
            namesArray.push(topic.slice(lastIndex + 1));
        });
        var exist = _.indexOf(namesArray, topicName);
        cb(exist);
    });
}
/**
 * returns topicsArray with topic names.
 * 
 */
function getTopics(cb) {
    pubsub.getTopics(function (error, topics) {
        if (error) {
            console.log(error);
            process.exit();
        }
        var topicsArray = topics.map(function (topic) {
            return topic.name;
        });
        cb(topicsArray);
    })
}

/**
 * publishes a message to a topic
 */

function publishMsg(topic, msg, createTopicIfAbsent,cb) {
    if (createTopicIfAbsent) createTopic(topic, function () {
        var _topic = pubsub.topic(topic);
        _topic.publish({
            data: msg
        }, function (error, response) {
            if (error) {
                console.log("ERROR %s", error);
            }
            cb(response);
        });

    });
}

var topic = "test-topic";
var guid = uuid.v4();
var msg = {data:guid};
var createTopicIfAbsent = true;
/**
 * publish a message to a topic.
 * create the topic if it doesn't exist
 */
publishMsg(topic, msg, createTopicIfAbsent, function (response) {
    console.dir("published message "+JSON.stringify(msg));
});
