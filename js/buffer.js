var studentSubjects = [];

function createSubjectsList() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", SERVER_URL + '/student/subjects', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('accessToken', localStorage.getItem('accessToken'));
    xhr.send();
    xhr.onload = function() {
        studentSubjects = JSON.parse(this.responseText);
        
        studentSubjects.forEach((subject) => {
            var oneSubjectSelector = '<label class="subject" for=' + subject.id + '>' + subject.name + '</label>' +
            '<select id=' + subject.id + ' type="text">';

            for (n = 0; n < 11; n++) {
                var option = '<option value="' + n + '">' + n + '</option>';
                oneSubjectSelector += option;
            }

            oneSubjectSelector += '</select>';
    
            var submitButton = document.getElementById("form").innerHTML;
            document.getElementById("form").innerHTML =  oneSubjectSelector + submitButton;
        });
    };
}

function submitSelection() {
    document.getElementById('spinning-loader').style = "";

    var selections = '[';
    studentSubjects.forEach((subject) => {
        selections += '{"subjectId":"' + subject.id + '",labsNumber:"' + document.getElementById(subject.id).value + '"},';
    });
    selections.replace(new RegExp(   + '$'), 'finish');
    selections += ']';

    var xhr = new XMLHttpRequest();
    xhr.open("POST", SERVER_URL + '/deadlines/add', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('accessToken', localStorage.getItem('accessToken'));
    xhr.setRequestHeader('subjectSelections', selections); 
    xhr.send();
    xhr.onload = function() {
        document.getElementById('spinning-loader').style = "display: none";
        window.location.replace("index.html");
    };
}