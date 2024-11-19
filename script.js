const apiUrl = "https://jsonplaceholder.typicode.com/users";
const userListDiv = document.getElementById("user-list");
const addUserButton = document.getElementById("add-user-btn");
const userFormDiv = document.getElementById("user-form");
const userForm = document.getElementById("userForm");
const cancelBtn = document.getElementById("cancelBtn");
const errorMessageDiv = document.getElementById("error-message");

let users = [];

// search users and display them 
const fetchUsers = async () => {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch users");
        users = await response.json();
        renderUserList();
    } catch (error) {
        displayError(error.message);
    }
};

// display the user/users list
const renderUserList = () => {
    userListDiv.innerHTML = "";
    users.forEach(user => {
        const userDiv = document.createElement("div");
        userDiv.className = "user-item";
        userDiv.innerHTML = `
            <span>${user.id} - ${user.firstName} ${user.lastName} (${user.email}) - ${user.department}</span>
            <button onclick="editUser(${user.id})">Edit</button>
            <button onclick="deleteUser(${user.id})">Delete</button>
        `;
        userListDiv.appendChild(userDiv);
    });
};

// Displays the form to add or edit.
const showUserForm = (user = null) => {
    userFormDiv.classList.remove("hidden");
    document.getElementById("form-title").textContent = user ? "Edit User" : "Add User";
    document.getElementById("firstName").value = user ? user.firstName : "";
    document.getElementById("lastName").value = user ? user.lastName : "";
    document.getElementById("email").value = user ? user.email : "";
    document.getElementById("department").value = user ? user.department : "";
    document.getElementById("userId").value = user ? user.id : "";
    document.getElementById("submitBtn").textContent = user ? "Update User" : "Add User";
};

// Closes the form
const closeForm = () => {
    userFormDiv.classList.add("hidden");
    userForm.reset();
};

// To add a new user
const addUser = async (userData) => {
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error("Failed to add user");
        const newUser = await response.json();
        users.push(newUser);
        renderUserList();
        closeForm();
    } catch (error) {
        displayError(error.message);
    }
};

// To edit an existing user
const editUser = async (userId) => {
    const user = users.find(u => u.id === userId);
    showUserForm(user);
};

// to update existing user details
const updateUser = async (userId, updatedData) => {
    try {
        const response = await fetch(`${apiUrl}/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) throw new Error("Failed to update user");
        const updatedUser = await response.json();
        users = users.map(u => u.id === userId ? updatedUser : u);
        renderUserList();
        closeForm();
    } catch (error) {
        displayError(error.message);
    }
};

// To delete an existing user
const deleteUser = async (userId) => {
    try {
        const response = await fetch(`${apiUrl}/${userId}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete user");
        users = users.filter(u => u.id !== userId);
        renderUserList();
    } catch (error) {
        displayError(error.message);
    }
};

// Submission form to (Add or Edit)
userForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const userId = document.getElementById("userId").value;
    const userData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value,
    };
    if (userId) {
        updateUser(userId, userData);
    } else {
        addUser(userData);
    }
});

// Cancel form
cancelBtn.addEventListener("click", closeForm);

// To display error messages
const displayError = (message) => {
    errorMessageDiv.textContent = message;
    errorMessageDiv.classList.remove("hidden");
};

// Initializing app
const init = () => {
    fetchUsers();
    addUserButton.addEventListener("click", () => showUserForm());
};

// Run initialization
init();
