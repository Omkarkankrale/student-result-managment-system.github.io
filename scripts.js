// Simulated backend data
const data = {
    admin: {
        username: "admin",
        password: "admin123"
    },
    students: []
};

// Utility function to save data
function saveData() {
    localStorage.setItem('data', JSON.stringify(data));
}

// Utility function to load data
function loadData() {
    const storedData = localStorage.getItem('data');
    if (storedData) {
        Object.assign(data, JSON.parse(storedData));
    }
}

// Initial load of data
loadData();

// Function to generate random student data
function generateRandomData(num) {
    const names = ["John", "Jane", "Jim", "Jack", "Jill", "James", "Judy", "Joe", "Jenny", "Jordan"];
    const surnames = ["Smith", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin"];
    
    for (let i = 0; i < num; i++) {
        const name = `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
        const roll = `R${String(i + 1).padStart(3, '0')}`;
        const marks = Math.floor(Math.random() * 101); // Marks between 0 and 100

        data.students.push({ name, roll, marks });
    }
    saveData();
}

// Generate 100 random students if not already generated
if (data.students.length === 0) {
    generateRandomData(100);
}

// Admin Login
document.getElementById('adminLoginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    if (username === data.admin.username && password === data.admin.password) {
        window.location.href = 'admin-dashboard.html';
    } else {
        alert('Invalid credentials!');
    }
});

// Student Login
document.getElementById('studentLoginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const rollNumber = document.getElementById('studentRollNumber').value;
    const student = data.students.find(student => student.roll === rollNumber);

    if (student) {
        localStorage.setItem('loggedStudent', JSON.stringify(student));
        window.location.href = 'student-dashboard.html';
    } else {
        alert('Invalid roll number!');
    }
});

// Admin Dashboard
if (window.location.pathname.endsWith('admin-dashboard.html')) {
    const resultForm = document.getElementById('resultForm');
    const resultsTableBody = document.querySelector('#resultsTable tbody');

    function updateResultsTable() {
        resultsTableBody.innerHTML = '';
        data.students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.roll}</td>
                <td>${student.marks}</td>
                <td>
                    <button onclick="deleteStudent(${index})">Delete</button>
                </td>
            `;
            resultsTableBody.appendChild(row);
        });
    }

    resultForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('studentName').value;
        const roll = document.getElementById('rollNumber').value;
        const marks = document.getElementById('marks').value;

        data.students.push({ name, roll, marks });
        saveData();
        updateResultsTable();
        resultForm.reset();
    });

    window.deleteStudent = function(index) {
        data.students.splice(index, 1);
        saveData();
        updateResultsTable();
    };

    updateResultsTable();
}

// Student Dashboard
if (window.location.pathname.endsWith('student-dashboard.html')) {
    const loggedStudent = JSON.parse(localStorage.getItem('loggedStudent'));
    if (loggedStudent) {
        const studentResultsTableBody = document.querySelector('#studentResultsTable tbody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loggedStudent.name}</td>
            <td>${loggedStudent.roll}</td>
            <td>${loggedStudent.marks}</td>
        `;
        studentResultsTableBody.appendChild(row);
    }
}
