const backendURL = 'http://localhost:3000/api'; // Update this if your backend is hosted elsewhere

let token = '';
let userRole = '';
let userName = '';

// Registration Form
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;
    const avatar = document.getElementById('register-avatar').files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    if (avatar) {
        formData.append('avatar', avatar);
    }

    try {
        const res = await fetch(`${backendURL}/register`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        alert(data.message);
        registerForm.reset();
    } catch (error) {
        console.error('Error:', error);
        alert('Registration failed.');
    }
});

// Login Form
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${backendURL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) {
            token = data.token;
            userRole = data.user.role;
            userName = data.user.name;
            document.getElementById('auth-section').style.display = 'none';
            document.getElementById('courses-section').style.display = 'block';
            document.getElementById('user-name').innerText = userName;
            loadCourses();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Login failed.');
    }
});

// Logout Button
const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', () => {
    token = '';
    userRole = '';
    userName = '';
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('courses-section').style.display = 'none';
    loginForm.reset();
    registerForm.reset();
});

// Load Courses
const loadCourses = async () => {
    try {
        const res = await fetch(`${backendURL}/get-all-courses`);
        const courses = await res.json();
        const coursesList = document.getElementById('courses-list');
        coursesList.innerHTML = '';

        courses.forEach(course => {
            const li = document.createElement('li');
            li.className = 'course-item';
            li.innerHTML = `
                <span>${course.name} - $${course.price}</span>
                ${userRole === 'admin' ? `<button class="update-btn" onclick="updateCourse('${course._id}')">Update</button>` : ''}
                ${userRole === 'admin' ? `<button onclick="deleteCourse('${course._id}')">Delete</button>` : ''}
            `;
            coursesList.appendChild(li);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load courses.');
    }
};

// Add Course Form
const addCourseForm = document.getElementById('add-course-form');
addCourseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('course-name').value;
    const price = document.getElementById('course-price').value;

    try {
        const res = await fetch(`${backendURL}/add-course`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, price })
        });
        const data = await res.json();
        if (res.status === 200) {
            loadCourses();
            addCourseForm.reset();
        } else {
            alert(data.message || 'Failed to add course.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add course.');
    }
});

// Delete Course
const deleteCourse = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
        const res = await fetch(`${backendURL}/delete-course/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        if (res.status === 200) {
            loadCourses();
        } else {
            alert(data.message || 'Failed to delete course.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete course.');
    }
};

// Update Course
const updateCourse = async (id) => {
    const newName = prompt('Enter new course name:');
    const newPrice = prompt('Enter new course price:');

    if (!newName || !newPrice) {
        alert('All fields are required.');
        return;
    }

    try {
        const res = await fetch(`${backendURL}/patch-course/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: newName, price: newPrice })
        });
        const data = await res.json();
        if (res.status === 200) {
            loadCourses();
        } else {
            alert(data.message || 'Failed to update course.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update course.');
    }
};
