// Load the SDK
var AWS = require('aws-sdk');
var FileReader = require('filereader');
const fs = require('fs');

AWS.config.update({ region: 'us-east-1' });
const rekognitionArn = "arn:aws:rekognition:us-east-1:243801404091:project/siftClassifyObjects/version/siftClassifyObjects.2021-10-11T10.57.07/1633975028012";




let customLabelAPIRequest = (imgData) => new Promise((resolve) => {

    const bufferImage = Buffer.from(imgData, "base64");
    const rekognition = new AWS.Rekognition();

    const params = {
        Image: {
            Bytes: bufferImage
        },
        ProjectVersionArn: rekognitionArn,
        MaxResults: 5, // (optional) Max number of labels with highest confidence
        MinConfidence: 0.30 // (optional) Confidence threshold from 0 to 1, default is 0.55 if left blank
    };
    rekognition.detectCustomLabels(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            console.log('There was an error detecting the labels in the image provided. Check the console for more details.');
        } else {            
            resolve(data);
        }
    });
});


const dataToJson = (data) =>{

    let LabelData = {}
    let Labels = []
    LabelData.Labels = Labels;

    // data.CustomLabels.map((obj) => obj.Name).join(', ');

    data.CustomLabels.forEach(cLabel => {

        labelNode = {"Custom_Label": cLabel.Name,
                      "Confidence": cLabel.Confidence }
        Labels.push(labelNode)
    })

    return LabelData;
}

const detectAWSCustomLabels = async (imgData) => { 

    try {
        let data = await customLabelAPIRequest(imgData);   
        console.log(data);    
        return dataToJson(data);
    }
    catch (e) {
        console.log(e);
    }    
}

module.exports = { detectAWSCustomLabels };