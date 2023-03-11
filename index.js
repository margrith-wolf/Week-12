class Student {
    constructor(fullName, studentNo, bookTitle, bookCheckedOut, bookDueBack) {
        this.fullName = fullName;  
        this.studentNo = studentNo
        this.bookTitle = bookTitle;
        this.bookCheckedOut = bookCheckedOut;
        this.bookDueBack = bookDueBack;
    }
}

class StudentService {
    static url = 'https://6409213d6ecd4f9e18a92d71.mockapi.io/api/Students';

    static async getAllStudents() {
        const res = await fetch(this.url, {
            method: 'GET',
            headers: { 'content-type': 'application/json' },
        });
        if (res.ok) {
            return res.json();
        }
    }

    static getStudent(id) {
        return $.get(this.url + `/${id}`);
    }

    static createStudent(event) {
       return $.ajax({
            type: "POST",
            url: this.url,
            data: {
                fullName: document.getElementById('student-name').value,
                studentNo: document.getElementById('student-number').value,
                bookTitle: document.getElementById('book-title').value,
                bookCheckedOut: document.getElementById('date-checked-out').value,
                bookDueBack: document.getElementById('date-book-due').value,
            },
            dataType: 'application/json'
        })
    }

    //PUT request currently returns 400 error (bad request)...endpoint says Students/47...not sure what that means
    static updateStudent(id) {
        //updateStudentName()
        return $.ajax({
            url: this.url + `/${id}`,
            dataType: 'json',
            data: JSON.stringify('student-name'),
            contentType: 'application/json',
            type: 'PUT'
    });
}

    static deleteStudent(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

// function updateStudentName () {
//     let newName = document.getElementById('edit-name').value;
//     Student.fullName.append(newName);
// }

// Convert Date format
function convertDateFormat(ISODate) {
	const convertDate = new Date(ISODate);
	const newMonth = convertDate.getMonth() + 1;
	const newDayOfMonth = convertDate.getDate();
	const newYear = convertDate.getFullYear();
	return `${newMonth}/${newDayOfMonth}/${newYear}`;
};

class DOMmanager {
    static students;

    static getAllStudents() {
        StudentService.getAllStudents().then(students => this.render(students));
    }

    static deleteStudent(id) {
        StudentService.deleteStudent(id)
            .then(() => {
                return StudentService.getAllStudents();
            })
            .then((students) => this.render(students));
    }

    static createStudent() {
       StudentService.createStudent()
            .then(() => {
                return StudentService.getAllStudents();
            })
            .then((students) => this.render(students));
    }

    static updateStudent(id) {
        StudentService.updateStudent(id)
            .then(() => {
                return StudentService.getAllStudents();
            })
            .then((students) => this.render(students));
    }
    //render currently needs manual refresh to update...not sure why
    static render(students) { 
        this.students = students;
        $('#app-table').empty();
        for(let student of students) {
            const outDate = convertDateFormat(student.bookCheckedOut);
            const dueDate = convertDateFormat(student.bookDueBack);
            const capitalBook = student.bookTitle[0].toUpperCase() + student.bookTitle.substring(1);
           $('#app-table').prepend(
                `<tr>
                    <td scope="row">${student.studentNo}</td>
                    <td>${student.fullName}</td>
                    <td>${capitalBook}</td>
                    <td>${outDate}</td>
                    <td>${dueDate}</td>
                    <td><input id="edit-name"/><button class="btn btn-warning" onclick="DOMmanager.updateStudent('${student.id}')">Edit Student Name</button></td>
                    <td><button class="btn btn-danger" onclick="DOMmanager.deleteStudent('${student.id}')">Delete Student</button></td>
                 </tr>`
           );
        }
    }
}

$('#create-new-student').click((event) => DOMmanager.createStudent(event));

DOMmanager.getAllStudents();