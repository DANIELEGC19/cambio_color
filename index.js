var text;
var reader;
var replaced;
var colors;
var any;
var arr = [];
var nuevo_css = "";
var progress = document.querySelector('.percent');

function abortRead() {
    reader.abort();
}

function errorHandler(evt) {
    switch (evt.target.error.code) {
        case evt.target.error.NOT_FOUND_ERR:
            alert('File Not Found!');
            break;
        case evt.target.error.NOT_READABLE_ERR:
            alert('File is not readable');
            break;
        case evt.target.error.ABORT_ERR:
            break; // noop
        default:
            alert('An error occurred reading this file.');
    };
}

function updateProgress(evt) {
    // evt is an ProgressEvent.
    if (evt.lengthComputable) {
        var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
        // Increase the progress bar length.
        if (percentLoaded < 100) {
            progress.style.width = percentLoaded + '%';
            progress.textContent = percentLoaded + '%';
        }
    }
}

function handleFileSelect(evt) {
    // Reset progress indicator on new file selection.
    progress.style.width = '0%';
    progress.textContent = '0%';

    reader = new FileReader();
    reader.onerror = errorHandler;
    reader.onprogress = updateProgress;
    reader.onabort = function (e) {
        alert('File read cancelled');
    };
    reader.onloadstart = function (e) {
        document.getElementById('progress_bar').className = 'loading';
    };
    reader.onload = function (e) {
        // Ensure that the progress bar displays 100% at the end.
        text = reader.result;
        var reg_color = new RegExp(/(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{5}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{3}))|((rgb|RGB|rgba|RGBA)[(][0-9 ,]+[)])/gi);
        var reg_any = new RegExp(/(.+[{]([^{]|\s)*[}])/gi);
        var reg_obj = new RegExp(/(.+[{])/gi);
        any = text.match(reg_any);
        any.forEach((obj,index) => {
            if(obj.match(reg_color)){
                arr[index] = [obj.match(reg_obj), obj.match(reg_color)]
            }
        });
        colors = text.match(reg_color);
        colors = [...new Set(colors)];
        progress.style.width = '100%';
        progress.textContent = '100%';
        setTimeout("document.getElementById('progress_bar').className='';", 2000);
    }

    // Read in the image file as a binary string.
    reader.readAsBinaryString(evt.target.files[0]);
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);

window.onload = function () {
    var textFile = null,
        makeTextFile = function (text) {
            var data = new Blob([text], {
                type: 'text/plain'
            });

            if (textFile !== null) {
                window.URL.revokeObjectURL(textFile);
            }

            textFile = window.URL.createObjectURL(data);

            return textFile;
        };


    var create = document.getElementById('create');

    create.addEventListener('click', function () {
        const list = document.querySelector('#my-list');
        var string = "";
        arr.forEach((element, index) =>{
            element[1].forEach((color, index) =>
                string += "<div style='border: black 3px groove; height: 20px; width: 20px;background-color: "+color+";'></div><li class=listItem>" + color+ "--" +element[0]+ "</li><input type='text' class='color' id='" + color+ "--" +element[0]+ "' value='' />"
            )
        });
        list.innerHTML = string;
    }, false);

    var changeColor = document.getElementById('change');

    changeColor.addEventListener('click', function () {
        var items = document.getElementsByClassName('color');
        var css = [];
        for (var i = 0; i < items.length; i++) {
            if(!items[i].value.length == 0){
                css = items[i].id.split("--")
                text = text.replace(items[i].id, items[i].value);
                any.forEach((obj,index) => {
                    if(obj.match(css[1])){
                        any[index] = obj.replace(css[0], items[i].value)
                    }
                });
            }
        }
        any.forEach((obj,index) => {
            nuevo_css += obj
        });
        var link = document.getElementById('downloadlink');
        link.href = makeTextFile(nuevo_css);
        link.style.display = 'block';
    }, false);
};