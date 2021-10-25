// Load the SDK
var AWS = require('aws-sdk');
const Jimp = require("jimp");
const fs = require("fs");
const { resolve } = require('path/posix');


AWS.config.update({ region: 'us-east-1' });


let labelAPIRequest = (imgData) => new Promise((resolve) => {

    const bufferImage = Buffer.from(imgData, "base64");

    let LabelData = {}
    let Labels = []
    LabelData.Labels = Labels;

    const params = {
        Image: {
            Bytes: bufferImage
        },
        MaxLabels: 10
    }

    const client = new AWS.Rekognition();

    client.detectLabels(params, function (err, response) {
        if (err) {
            console.log(err, err.stack); // if an error occurred
            // return labelData;
        } else {

            response.Labels.forEach(label => {

                let parents = [];
                label.Parents.forEach(parent => {
                    parents.push(parent.Name)
                })

                labelNode = {
                    "Label": label.Name,
                    "Confidence": label.Confidence,
                    "Parents": parents.join(',')
                }

                LabelData.Labels.push(labelNode);

            })
            resolve(LabelData);       
        }
    })

});


const detectAWSLabels = async (imgData) => {    

    try {
        return await labelAPIRequest(imgData);       
    }
    catch (e) {
        console.log(e);
    }

}


module.exports = { detectAWSLabels };


