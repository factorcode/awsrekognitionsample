var AWS = require('aws-sdk');
var uuid = require('uuid');

let uploadImageToS3 = (imageBase64) => new Promise((resolve) => {
    
    let bucketName = "siftappuploads";
    const base64Data = new Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), 'base64');

    // Getting the file type, ie: jpeg, png or gif
    const typeChar = imageBase64.charAt(0);
    let typeOfImage = ".jpg";

    switch (typeChar) {
        case "/":
            typeOfImage = ".jpg"
            break;
        case "i":
            typeOfImage = ".png"
            break;
        case "R":
            typeOfImage = ".gif"
            break;
        case "U":
            typeOfImage = ".webp"
            break;
        default:
            typeOfImage = ".jpg"
            break;
    }

    // Create name for uploaded object key
    var keyName = 'image-' + uuid.v1();

    // Create a promise on S3 service object
    var bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' }).createBucket({ Bucket: bucketName }).promise();

    // Handle promise fulfilled/rejected states
    bucketPromise.then(
        function (response) {
            // Create params for putObject call
            const params = {
                Bucket: bucketName,
                Key: keyName + typeOfImage,
                Body: base64Data,
                ACL: 'public-read',
                ContentEncoding: 'base64', // required
                ContentType: `image/${typeOfImage}` // required. Notice the back ticks
            }
            // Create object upload promise
            var uploadPromise = new AWS.S3({ apiVersion: '2006-03-01' }).putObject(params).promise();
            uploadPromise.then(
                function (data) {
                    console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
                    let s3Imagepath = `https://${bucketName}.s3.amazonaws.com/${keyName}${typeOfImage}`
                    resolve(s3Imagepath);
                });
        }).catch(
            function (err) {
                console.error(err, err.stack);
            });
});

module.exports = { uploadImageToS3 };