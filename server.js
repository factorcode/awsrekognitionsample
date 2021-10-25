const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const { detectAWSLabels } = require('./rekognitionServices/DetectLabel')
const { detectAWSCustomLabels } = require('./rekognitionServices/DetectCustomLabel')

const app = express();
const port = 3000

app.set('port', port)

const server = app.listen(app.settings.port, () =>
    console.log(`Listening on ${app.settings.port}`)
)

app.use(express.static('public'))
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }))

app.get('/', (req, res) => {
    res.send('Sift Backend Server is Alive!'); // This works if no static path is defined
})

app.get('/awsService', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'UploadImage.html'))
})

app.post('/awsService/getlabels', async (req, res) => {  
    
    const apiResponse = await detectAWSLabels(req.body.eImage.split(',')[1]);
    console.log(apiResponse);
    res.json(apiResponse ? apiResponse : {message : "No Response from AWS API"});
    
})

app.post('/awsService/getcustomlabels', async (req, res) => {
    const apiResponse = await detectAWSCustomLabels(req.body.eImage.split(',')[1]);
    res.json(apiResponse ? apiResponse : {message : "No Response from AWS API"});
})

