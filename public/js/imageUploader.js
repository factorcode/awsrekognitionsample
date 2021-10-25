var encodedImage = "";


window.addEventListener('load', function () {
    document.querySelector('input[type="file"]').addEventListener('change', function () {
        if (this.files && this.files[0]) {
            var img = document.querySelector('img');
            img.onload = () => {
                URL.revokeObjectURL(img.src);  // no longer needed, free memory
            }

            img.src = URL.createObjectURL(this.files[0]); // set src to blob url
            
            getBase64(this.files[0]).then(
                data => encodedImage = data                
              );

        }
    });
});

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const postImage = (type) => {

    // console.log(encodedImage);
    //Obj of data to send in future like a dummyDb
    const data = { eImage: encodedImage };

    postUrl = window.location.href +  (type == "custom" ? "/getcustomlabels" : "/getlabels")
    console.log(postUrl);
    //POST request with body equal on data in JSON format
    fetch(postUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        //Then with the data from the response in JSON...
        .then((data) => {
            console.log('Success:', data);
        })
        //Then with the error genereted...
        .catch((error) => {
            console.error('Error:', error);
        });

    //	


}