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
var topic = "test-topic";
var subName = "node-cli";

function subscribe(topic) {
    pubsub.subscribe(topic, subName, {
        ackDeadlineSeconds: 10,
        reuseExisting: true,
        autoAck: true,
        interval: 30
    }, function (error, subscription, response) {
        if (error) {
            console.log(error);
            process.exit();
        }
        subscription.on('message',function(message){
            subscription.ack(uuid.v1());
            handleMessage(message);
        });

        
    });
}

function handleMessage(message){
    console.dir(message.data);
}

subscribe(topic);