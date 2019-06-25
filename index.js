var text;
var reader;
var replaced;
var colors;
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
        var reg = new RegExp(/(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{5}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{3}))|((rgb|RGB|rgba|RGBA)[(][0-9 ,]+[)])/gi);
        colors = text.match(reg);
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
        list.innerHTML = colors.map((element, index) =>
            "<div style='height: 20px; width: 20px;background-color: "+element+";'></div><li class=listItem>" + element + "</li><input type='text' class='color' id='" + element + "' value='' />"
        ).join('');
    }, false);

    var changeColor = document.getElementById('change');

    changeColor.addEventListener('click', function () {
        var items = document.getElementsByClassName('color');
        console.log(items)
        for (var i = 0; i < items.length; i++) {

            if(!items[i].value.length == 0){
            text = text.replace(items[i].id, items[i].value);
            }
        }
        var link = document.getElementById('downloadlink');
        link.href = makeTextFile(text);
        link.style.display = 'block';
    }, false);

};