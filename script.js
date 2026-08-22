/* =========================================================
   LeoDiary - COMPLETE SCRIPT
   Google Login + Email Login + Diary Features
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyBTHBWU0Yw-dz54Uzva_FLkD_yN7Vlu5jg",

    authDomain:
        "leodiary-app.firebaseapp.com",

    projectId:
        "leodiary-app",

    storageBucket:
        "leodiary-app.firebasestorage.app",

    messagingSenderId:
        "1098958390836",

    appId:
        "1:1098958390836:web:8ee2c1e81b9cb042c8ac61",

    measurementId:
        "G-S6M5ED5ME7"
};


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const googleProvider =
    new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: "select_account"
});


/* =========================================================
   ELEMENTS
========================================================= */

const authPage =
    document.getElementById("authPage");

const signupPage =
    document.getElementById("signupPage");

const appPage =
    document.getElementById("appPage");

const googleLoginBtn =
    document.getElementById("googleLoginBtn");

const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const signupName =
    document.getElementById("signupName");

const signupEmail =
    document.getElementById("signupEmail");

const signupPassword =
    document.getElementById("signupPassword");

const loginBtn =
    document.getElementById("loginBtn");

const showSignupBtn =
    document.getElementById("showSignupBtn");

const backToLoginBtn =
    document.getElementById("backToLoginBtn");

const forgotPasswordBtn =
    document.getElementById("forgotPasswordBtn");

const authMessage =
    document.getElementById("authMessage");

const signupMessage =
    document.getElementById("signupMessage");

const logoutBtn =
    document.getElementById("logoutBtn");

const welcomeUser =
    document.getElementById("welcomeUser");

const themeBtn =
    document.getElementById("themeBtn");

const addNoteBtn =
    document.getElementById("addNoteBtn");

const emptyAddBtn =
    document.getElementById("emptyAddBtn");

const searchInput =
    document.getElementById("searchInput");

const notesGrid =
    document.getElementById("notesGrid");

const favoriteGrid =
    document.getElementById("favoriteGrid");

const pinnedGrid =
    document.getElementById("pinnedGrid");

const emptyState =
    document.getElementById("emptyState");

const noteModal =
    document.getElementById("noteModal");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelNoteBtn =
    document.getElementById("cancelNoteBtn");

const saveNoteBtn =
    document.getElementById("saveNoteBtn");

const noteTitle =
    document.getElementById("noteTitle");

const noteContent =
    document.getElementById("noteContent");

const noteMood =
    document.getElementById("noteMood");

const modalTitle =
    document.getElementById("modalTitle");

const viewModal =
    document.getElementById("viewModal");

const closeViewBtn =
    document.getElementById("closeViewBtn");

const viewTitle =
    document.getElementById("viewTitle");

const viewMood =
    document.getElementById("viewMood");

const viewContent =
    document.getElementById("viewContent");

const viewDate =
    document.getElementById("viewDate");

const viewEditBtn =
    document.getElementById("viewEditBtn");

const viewDeleteBtn =
    document.getElementById("viewDeleteBtn");

const totalNotes =
    document.getElementById("totalNotes");

const totalFavorites =
    document.getElementById("totalFavorites");

const totalPinned =
    document.getElementById("totalPinned");

const currentMood =
    document.getElementById("currentMood");


/* =========================================================
   VARIABLES
========================================================= */

let currentUser = null;

let notes = [];

let editingNoteId = null;

let viewingNoteId = null;

let selectedColor = "blue";

let currentFilter = "all";


/* =========================================================
   AUTH MESSAGE
========================================================= */

function showLoginMessage(message, success = false) {

    authMessage.textContent = message;

    authMessage.style.color =
        success ? "#16a34a" : "#e53935";
}


function showSignupMessage(message, success = false) {

    signupMessage.textContent = message;

    signupMessage.style.color =
        success ? "#16a34a" : "#e53935";
}


/* =========================================================
   FIREBASE ERROR
========================================================= */

function firebaseMessage(error) {

    const code = error?.code || "";

    switch (code) {

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/user-not-found":
            return "No account found with this email.";

        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Incorrect email or password.";

        case "auth/email-already-in-use":
            return "This email is already registered.";

        case "auth/weak-password":
            return "Password must be at least 6 characters.";

        case "auth/popup-closed-by-user":
            return "Google sign-in was cancelled.";

        case "auth/popup-blocked":
            return "Google login popup was blocked.";

        case "auth/unauthorized-domain":
            return "Add your GitHub Pages domain to Firebase Authorized Domains.";

        case "auth/network-request-failed":
            return "Network error. Check your internet.";

        case "auth/operation-not-allowed":
            return "This login method is not enabled in Firebase.";

        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";

        default:
            return error?.message ||
                "Something went wrong.";
    }
}


/* =========================================================
   GOOGLE LOGIN
========================================================= */

googleLoginBtn.addEventListener(
    "click",
    async () => {

        googleLoginBtn.disabled = true;

        googleLoginBtn.innerHTML =
            "Signing in...";

        showLoginMessage("");

        try {

            await signInWithPopup(
                auth,
                googleProvider
            );

        } catch (error) {

            console.error(error);

            showLoginMessage(
                firebaseMessage(error)
            );

            googleLoginBtn.disabled = false;

            googleLoginBtn.innerHTML = `
                <span class="google-icon">G</span>
                <span>Continue with Google</span>
            `;
        }
    }
);


/* =========================================================
   EMAIL LOGIN
========================================================= */

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        showLoginMessage("");

        loginBtn.disabled = true;

        loginBtn.textContent =
            "Signing in...";

        try {

            await signInWithEmailAndPassword(
                auth,
                loginEmail.value.trim(),
                loginPassword.value
            );

        } catch (error) {

            console.error(error);

            showLoginMessage(
                firebaseMessage(error)
            );

            loginBtn.disabled = false;

            loginBtn.textContent =
                "Sign In";
        }
    }
);


/* =========================================================
   SHOW SIGNUP
========================================================= */

showSignupBtn.addEventListener(
    "click",
    () => {

        authPage.classList.add("hidden");

        signupPage.classList.remove("hidden");

        signupMessage.textContent = "";

        signupForm.reset();
    }
);


/* =========================================================
   BACK TO LOGIN
========================================================= */

backToLoginBtn.addEventListener(
    "click",
    () => {

        signupPage.classList.add("hidden");

        authPage.classList.remove("hidden");

        authMessage.textContent = "";
    }
);


/* =========================================================
   CREATE ACCOUNT
========================================================= */

signupForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        showSignupMessage("");

        const name =
            signupName.value.trim();

        const email =
            signupEmail.value.trim();

        const password =
            signupPassword.value;

        if (name.length < 2) {

            showSignupMessage(
                "Please enter your name."
            );

            return;
        }

        if (password.length < 6) {

            showSignupMessage(
                "Password must be at least 6 characters."
            );

            return;
        }

        const submitBtn =
            signupForm.querySelector(
                "button[type='submit']"
            );

        submitBtn.disabled = true;

        submitBtn.textContent =
            "Creating account...";

        try {

            const result =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            await updateProfile(
                result.user,
                {
                    displayName: name
                }
            );

            showSignupMessage(
                "Account created successfully!",
                true
            );

        } catch (error) {

            console.error(error);

            showSignupMessage(
                firebaseMessage(error)
            );

            submitBtn.disabled = false;

            submitBtn.textContent =
                "Create Account";
        }
    }
);


/* =========================================================
   FORGOT PASSWORD
========================================================= */

forgotPasswordBtn.addEventListener(
    "click",
    async () => {

        const email =
            loginEmail.value.trim();

        if (!email) {

            showLoginMessage(
                "Enter your email first."
            );

            loginEmail.focus();

            return;
        }

        try {

            await sendPasswordResetEmail(
                auth,
                email
            );

            showLoginMessage(
                "Password reset email sent.",
                true
            );

        } catch (error) {

            console.error(error);

            showLoginMessage(
                firebaseMessage(error)
            );
        }
    }
);


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (user) {

            currentUser = user;

            authPage.classList.add("hidden");

            signupPage.classList.add("hidden");

            appPage.classList.remove("hidden");

            const name =
                user.displayName ||
                user.email?.split("@")[0] ||
                "User";

            welcomeUser.textContent =
                "Welcome, " + name;

            loadNotes();

        } else {

            currentUser = null;

            appPage.classList.add("hidden");

            signupPage.classList.add("hidden");

            authPage.classList.remove("hidden");

            loginBtn.disabled = false;

            loginBtn.textContent =
                "Sign In";
        }
    }
);


/* =========================================================
   LOGOUT
========================================================= */

logoutBtn.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

        } catch (error) {

            console.error(error);

        }
    }
);


/* =========================================================
   STORAGE KEY
========================================================= */

function getStorageKey() {

    if (!currentUser) {
        return "leoDiaryNotes_guest";
    }

    return "leoDiaryNotes_" +
        currentUser.uid;
}


/* =========================================================
   LOAD NOTES
========================================================= */

function loadNotes() {

    try {

        const saved =
            localStorage.getItem(
                getStorageKey()
            );

        notes =
            saved
                ? JSON.parse(saved)
                : [];

        if (!Array.isArray(notes)) {
            notes = [];
        }

    } catch (error) {

        console.error(error);

        notes = [];
    }

    renderAll();
}


/* =========================================================
   SAVE NOTES
========================================================= */

function saveNotes() {

    if (!currentUser) {
        return;
    }

    localStorage.setItem(
        getStorageKey(),
        JSON.stringify(notes)
    );
}


/* =========================================================
   CREATE NOTE ID
========================================================= */

function createId() {

    return Date.now().toString() +
        Math.random()
            .toString(36)
            .slice(2);
}


/* =========================================================
   OPEN NEW NOTE
========================================================= */

function openNewNote() {

    editingNoteId = null;

    modalTitle.textContent =
        "New Note";

    noteTitle.value = "";

    noteContent.value = "";

    noteMood.value = "😊";

    selectedColor = "blue";

    updateColorButtons();

    noteModal.classList.remove("hidden");

    setTimeout(() => {
        noteTitle.focus();
    }, 100);
}


addNoteBtn.addEventListener(
    "click",
    openNewNote
);


emptyAddBtn.addEventListener(
    "click",
    openNewNote
);


/* =========================================================
   CLOSE NOTE MODAL
========================================================= */

function closeNoteModal() {

    noteModal.classList.add("hidden");

    editingNoteId = null;
}


closeModalBtn.addEventListener(
    "click",
    closeNoteModal
);


cancelNoteBtn.addEventListener(
    "click",
    closeNoteModal
);


/* =========================================================
   COLOR BUTTONS
========================================================= */

document
    .querySelectorAll(".color-option")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                selectedColor =
                    button.dataset.color;

                updateColorButtons();
            }
        );
    });


function updateColorButtons() {

    document
        .querySelectorAll(".color-option")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.color ===
                selectedColor
            );
        });
}


/* =========================================================
   SAVE NOTE
========================================================= */

saveNoteBtn.addEventListener(
    "click",
    () => {

        const title =
            noteTitle.value.trim();

        const content =
            noteContent.value.trim();

        const mood =
            noteMood.value;

        if (!title && !content) {

            alert(
                "Please write something first."
            );

            return;
        }


        if (editingNoteId) {

            const note =
                notes.find(
                    item =>
                        item.id ===
                        editingNoteId
                );

            if (note) {

                note.title =
                    title || "Untitled Note";

                note.content =
                    content;

                note.mood =
                    mood;

                note.color =
                    selectedColor;

                note.updated =
                    new Date().toISOString();
            }

        } else {

            const now =
                new Date().toISOString();

            notes.unshift({

                id: createId(),

                title:
                    title || "Untitled Note",

                content:

                    content,

                mood:
                    mood,

                color:
                    selectedColor,

                favorite:
                    false,

                pinned:
                    false,

                created:
                    now,

                updated:
                    now
            });
        }


        saveNotes();

        closeNoteModal();

        renderAll();
    }
);


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date) {

    if (!date) {
        return "";
    }

    try {

        return new Date(date)
            .toLocaleDateString(
                undefined,
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );

    } catch {

        return "";
    }
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   NOTE CARD
========================================================= */

function noteCard(note) {

    const favoriteIcon =
        note.favorite ? "⭐" : "☆";

    const pinIcon =
        note.pinned ? "📌" : "📍";

    return `
        <article
            class="note-card ${escapeHTML(note.color || "blue")}"
            data-id="${escapeHTML(note.id)}"
        >

            <div class="note-top">

                <span class="note-mood">
                    ${escapeHTML(note.mood || "😊")}
                </span>

                <div class="note-actions">

                    <button
                        class="note-action favorite-action"
                        data-id="${escapeHTML(note.id)}"
                        title="Favorite"
                        type="button"
                    >
                        ${favoriteIcon}
                    </button>

                    <button
                        class="note-action pin-action"
                        data-id="${escapeHTML(note.id)}"
                        title="Pin"
                        type="button"
                    >
                        ${pinIcon}
                    </button>

                </div>

            </div>

            <h3 class="note-title">
                ${escapeHTML(
                    note.title || "Untitled Note"
                )}
            </h3>

            <p class="note-preview">
                ${escapeHTML(
                    note.content || "No content"
                )}
            </p>

            <small class="note-date">
                ${formatDate(note.updated || note.created)}
            </small>

        </article>
    `;
}


/* =========================================================
   RENDER NOTES
========================================================= */

function renderNotes(list, container) {

    if (!list.length) {

        container.innerHTML = "";

        return;
    }

    container.innerHTML =
        list.map(noteCard).join("");

    attachNoteEvents(container);
}


/* =========================================================
   ATTACH NOTE EVENTS
========================================================= */

function attachNoteEvents(container) {

    container
        .querySelectorAll(".note-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".note-action"
                        )
                    ) {
                        return;
                    }

                    openView(
                        card.dataset.id
                    );
                }
            );
        });


    container
        .querySelectorAll(".favorite-action")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    toggleFavorite(
                        button.dataset.id
                    );
                }
            );
        });


    container
        .querySelectorAll(".pin-action")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    togglePin(
                        button.dataset.id
                    );
                }
            );
        });
}


/* =========================================================
   FILTER NOTES
========================================================= */

function getFilteredNotes() {

    let result = [...notes];

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    if (search) {

        result =
            result.filter(note =>

                (note.title || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (note.content || "")
                    .toLowerCase()
                    .includes(search)
            );
    }


    if (currentFilter === "favorite") {

        result =
            result.filter(
                note => note.favorite
            );
    }


    if (currentFilter === "pinned") {

        result =
            result.filter(
                note => note.pinned
            );
    }


    if (currentFilter === "recent") {

        result.sort(
            (a, b) =>
                new Date(b.updated) -
                new Date(a.updated)
        );
    }


    return result;
}


/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener(
    "input",
    renderAll
);


/* =========================================================
   FILTER BUTTONS
========================================================= */

document
    .querySelectorAll(".filter-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".filter-btn")
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );

                button.classList.add("active");

                currentFilter =
                    button.dataset.filter;

                renderAll();
            }
        );
    });


/* =========================================================
   TOGGLE FAVORITE
========================================================= */

function toggleFavorite(id) {

    const note =
        notes.find(
            item => item.id === id
        );

    if (!note) {
        return;
    }

    note.favorite =
        !note.favorite;

    note.updated =
        new Date().toISOString();

    saveNotes();

    renderAll();
}


/* =========================================================
   TOGGLE PIN
========================================================= */

function togglePin(id) {

    const note =
        notes.find(
            item => item.id === id
        );

    if (!note) {
        return;
    }

    note.pinned =
        !note.pinned;

    note.updated =
        new Date().toISOString();

    saveNotes();

    renderAll();
}


/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {

    if (!currentUser) {
        return;
    }


    const filtered =
        getFilteredNotes();


    renderNotes(
        filtered,
        notesGrid
    );


    const favorites =
        notes.filter(
            note => note.favorite
        );

    renderNotes(
        favorites,
        favoriteGrid
    );


    const pinned =
        notes.filter(
            note => note.pinned
        );

    renderNotes(
        pinned,
        pinnedGrid
    );


    emptyState.classList.toggle(
        "hidden",
        filtered.length !== 0
    );


    updateStats();
}


/* =========================================================
   OPEN VIEW MODAL
========================================================= */

function openView(id) {

    const note =
        notes.find(
            item => item.id === id
        );

    if (!note) {
        return;
    }

    viewingNoteId = id;

    viewMood.textContent =
        note.mood || "😊";

    viewTitle.textContent =
        note.title || "Untitled Note";

    viewContent.textContent =
        note.content || "No content";

    viewDate.textContent =
        "Last updated: " +
        formatDate(
            note.updated || note.created
        );

    viewModal.classList.remove("hidden");
}


/* =========================================================
   CLOSE VIEW
========================================================= */

function closeView() {

    viewModal.classList.add("hidden");

    viewingNoteId = null;
}


closeViewBtn.addEventListener(
    "click",
    closeView
);


/* =========================================================
   EDIT NOTE
========================================================= */

viewEditBtn.addEventListener(
    "click",
    () => {

        if (!viewingNoteId) {
            return;
        }

        const note =
            notes.find(
                item =>
                    item.id ===
                    viewingNoteId
            );

        if (!note) {
            return;
        }

        editingNoteId =
            note.id;

        modalTitle.textContent =
            "Edit Note";

        noteTitle.value =
            note.title || "";

        noteContent.value =
            note.content || "";

        noteMood.value =
            note.mood || "😊";

        selectedColor =
            note.color || "blue";

        updateColorButtons();

        closeView();

        noteModal.classList.remove(
            "hidden"
        );

        noteTitle.focus();
    }
);


/* =========================================================
   DELETE NOTE
========================================================= */

viewDeleteBtn.addEventListener(
    "click",
    () => {

        if (!viewingNoteId) {
            return;
        }

        const confirmed =
            confirm(
                "Delete this note permanently?"
            );

        if (!confirmed) {
            return;
        }

        notes =
            notes.filter(
                note =>
                    note.id !==
                    viewingNoteId
            );

        saveNotes();

        closeView();

        renderAll();
    }
);


/* =========================================================
   NAVIGATION
========================================================= */

const sections = {

    home:
        document.getElementById(
            "homeSection"
        ),

    favorites:
        document.getElementById(
            "favoritesSection"
        ),

    pinned:
        document.getElementById(
            "pinnedSection"
        ),

    stats:
        document.getElementById(
            "statsSection"
        )
};


document
    .querySelectorAll(".nav-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".nav-btn")
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );

                button.classList.add("active");


                Object.values(sections)
                    .forEach(section =>
                        section.classList.add(
                            "hidden"
                        )
                    );


                const section =
                    sections[
                        button.dataset.section
                    ];

                if (section) {

                    section.classList.remove(
                        "hidden"
                    );
                }


                renderAll();
            }
        );
    });


/* =========================================================
   STATISTICS
========================================================= */

function updateStats() {

    totalNotes.textContent =
        notes.length;

    totalFavorites.textContent =
        notes.filter(
            note => note.favorite
        ).length;

    totalPinned.textContent =
        notes.filter(
            note => note.pinned
        ).length;

    if (notes.length) {

        const latest =
            [...notes].sort(
                (a, b) =>
                    new Date(b.updated) -
                    new Date(a.updated)
            )[0];

        currentMood.textContent =
            latest?.mood || "—";

    } else {

        currentMood.textContent =
            "—";
    }
}


/* =========================================================
   DARK MODE
========================================================= */

function loadTheme() {

    const saved =
        localStorage.getItem(
            "leoDiaryTheme"
        );

    if (saved === "dark") {

        document.body.classList.add(
            "dark"
        );

        themeBtn.textContent =
            "☀️";

    } else {

        document.body.classList.remove(
            "dark"
        );

        themeBtn.textContent =
            "🌙";
    }
}


themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );

        const dark =
            document.body.classList.contains(
                "dark"
            );

        localStorage.setItem(
            "leoDiaryTheme",
            dark ? "dark" : "light"
        );

        themeBtn.textContent =
            dark ? "☀️" : "🌙";
    }
);


loadTheme();


/* =========================================================
   CLOSE MODALS BY BACKDROP
========================================================= */

noteModal.addEventListener(
    "click",
    event => {

        if (event.target === noteModal) {

            closeNoteModal();
        }
    }
);


viewModal.addEventListener(
    "click",
    event => {

        if (event.target === viewModal) {

            closeView();
        }
    }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeNoteModal();

            closeView();
        }
    }
);


/* =========================================================
   INITIAL THEME
========================================================= */

loadTheme();
