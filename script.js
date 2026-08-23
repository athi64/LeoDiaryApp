/* =====================================================
   LEODIARY
   Firebase Authentication + Firestore
   Google Login
   Email Login
   Create Account
   Forgot Password
   Notes / Search / Favorite / Pin
===================================================== */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut,
    setPersistence,
    inMemoryPersistence
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    doc,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =====================================================
   FIREBASE CONFIG
===================================================== */

const firebaseConfig = {

    apiKey:
        "AIzaSyCFR9EzIQ9O6UAZpbURCC9VlyFqpifNJz0",

    authDomain:
        "leodiary-app-6eff0.firebaseapp.com",

    projectId:
        "leodiary-app-6eff0",

    storageBucket:
        "leodiary-app-6eff0.firebasestorage.app",

    messagingSenderId:
        "584697796566",

    appId:
        "1:584697796566:web:a2d7e223c20b5bef5d3677",

    measurementId:
        "G-8WQVR40LV8"

};


/* =====================================================
   INITIALIZE FIREBASE
===================================================== */

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getFirestore(app);

const googleProvider =
    new GoogleAuthProvider();


googleProvider.setCustomParameters({
    prompt: "select_account"
});


/* =====================================================
   SESSION
===================================================== */

await setPersistence(
    auth,
    inMemoryPersistence
);


/* =====================================================
   ELEMENTS
===================================================== */

const loginPage =
    document.getElementById("loginPage");

const diaryPage =
    document.getElementById("diaryPage");


const googleLoginBtn =
    document.getElementById("googleLoginBtn");

const emailForm =
    document.getElementById("emailForm");

const emailInput =
    document.getElementById("emailInput");

const passwordInput =
    document.getElementById("passwordInput");

const emailLoginBtn =
    document.getElementById("emailLoginBtn");

const emailSignupBtn =
    document.getElementById("emailSignupBtn");

const forgotPasswordBtn =
    document.getElementById("forgotPasswordBtn");

const emailError =
    document.getElementById("emailError");


const logoutBtn =
    document.getElementById("logoutBtn");

const userEmail =
    document.getElementById("userEmail");


/* =====================================================
   NOTE ELEMENTS
===================================================== */

const newNoteBtn =
    document.getElementById("newNoteBtn");

const addNoteBtn =
    document.getElementById("addNoteBtn");

const addNoteBtn2 =
    document.getElementById("addNoteBtn2");

const emptyAddNoteBtn =
    document.getElementById("emptyAddNoteBtn");


const notesList =
    document.getElementById("notesList");

const emptyNotes =
    document.getElementById("emptyNotes");


const noteSearchInput =
    document.getElementById("noteSearchInput");


const allNotesFilter =
    document.getElementById("allNotesFilter");

const favoriteFilter =
    document.getElementById("favoriteFilter");

const pinnedFilter =
    document.getElementById("pinnedFilter");


/* =====================================================
   STATISTICS
===================================================== */

const totalNotes =
    document.getElementById("totalNotes");

const favoriteNotes =
    document.getElementById("favoriteNotes");

const pinnedNotes =
    document.getElementById("pinnedNotes");


/* =====================================================
   NOTE MODAL
===================================================== */

const noteModal =
    document.getElementById("noteModal");

const noteModalTitle =
    document.getElementById("noteModalTitle");

const closeNoteModal =
    document.getElementById("closeNoteModal");

const noteTitleInput =
    document.getElementById("noteTitleInput");

const noteContentInput =
    document.getElementById("noteContentInput");

const noteMoodInput =
    document.getElementById("noteMoodInput");

const noteColorInput =
    document.getElementById("noteColorInput");

const cancelNoteBtn =
    document.getElementById("cancelNoteBtn");

const saveNoteBtn =
    document.getElementById("saveNoteBtn");


/* =====================================================
   VIEW MODAL
===================================================== */

const viewNoteModal =
    document.getElementById("viewNoteModal");

const closeViewNoteModal =
    document.getElementById("closeViewNoteModal");

const viewNoteTitle =
    document.getElementById("viewNoteTitle");

const viewNoteMood =
    document.getElementById("viewNoteMood");

const viewNoteContent =
    document.getElementById("viewNoteContent");

const viewNoteDate =
    document.getElementById("viewNoteDate");

const editNoteBtn =
    document.getElementById("editNoteBtn");

const deleteNoteBtn =
    document.getElementById("deleteNoteBtn");


/* =====================================================
   STATE
===================================================== */

let currentUser = null;

let notes = [];

let currentFilter = "all";

let searchText = "";

let editingNoteId = null;

let viewingNoteId = null;


/* =====================================================
   PAGE CONTROL
===================================================== */

function showLoginPage() {

    loginPage?.classList.remove("hidden");

    diaryPage?.classList.add("hidden");

}


function showDiaryPage() {

    loginPage?.classList.add("hidden");

    diaryPage?.classList.remove("hidden");

}


/* =====================================================
   ERROR MESSAGE
===================================================== */

function showMessage(
    message,
    type = "error"
) {

    if (!emailError) {
        return;
    }


    emailError.textContent =
        message || "";


    if (type === "success") {

        emailError.style.color =
            "#16a34a";

    } else {

        emailError.style.color =
            "#e11d48";

    }

}


/* =====================================================
   FIREBASE ERROR HANDLER
===================================================== */

function getAuthErrorMessage(error) {

    const code =
        error?.code || "";


    const messages = {

        "auth/invalid-email":
            "Please enter a valid email address.",

        "auth/missing-password":
            "Please enter your password.",

        "auth/weak-password":
            "Password must contain at least 6 characters.",

        "auth/email-already-in-use":
            "This email is already registered.",

        "auth/invalid-credential":
            "Incorrect email or password.",

        "auth/wrong-password":
            "Incorrect password.",

        "auth/user-not-found":
            "No account found with this email.",

        "auth/user-disabled":
            "This account has been disabled.",

        "auth/popup-closed-by-user":
            "Google login was cancelled.",

        "auth/popup-blocked":
            "Google popup was blocked by the browser.",

        "auth/unauthorized-domain":
            "This website is not authorized in Firebase.",

        "auth/network-request-failed":
            "Network error. Check your internet connection.",

        "auth/too-many-requests":
            "Too many attempts. Please try again later.",

        "auth/operation-not-allowed":
            "This login method is not enabled in Firebase.",

        "auth/account-exists-with-different-credential":
            "This email already uses another login method.",

        "auth/invalid-action-code":
            "This password reset link is invalid or expired.",

        "auth/expired-action-code":
            "This password reset link has expired."

    };


    return (
        messages[code] ||
        "Something went wrong. Please try again."
    );

}


/* =====================================================
   GOOGLE LOGIN
===================================================== */

googleLoginBtn?.addEventListener(
    "click",
    async () => {

        showMessage("");

        googleLoginBtn.disabled =
            true;

        googleLoginBtn.innerHTML =
            "Signing in...";


        try {

            await signInWithPopup(
                auth,
                googleProvider
            );


        } catch (error) {

            console.error(
                "Google Login Error:",
                error
            );


            showMessage(
                getAuthErrorMessage(error)
            );


        } finally {

            googleLoginBtn.disabled =
                false;

            googleLoginBtn.innerHTML = `
                <span class="google-icon">G</span>
                <span>Continue with Google</span>
            `;

        }

    }
);


/* =====================================================
   EMAIL LOGIN
===================================================== */

emailForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        showMessage("");


        const email =
            emailInput?.value.trim() || "";

        const password =
            passwordInput?.value || "";


        if (!email) {

            showMessage(
                "Enter your email address."
            );

            emailInput?.focus();

            return;

        }


        if (!password) {

            showMessage(
                "Enter your password."
            );

            passwordInput?.focus();

            return;

        }


        emailLoginBtn.disabled =
            true;

        emailLoginBtn.textContent =
            "Logging in...";


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            if (emailInput) {
                emailInput.value = "";
            }

            if (passwordInput) {
                passwordInput.value = "";
            }


        } catch (error) {

            console.error(
                "Email Login Error:",
                error
            );


            showMessage(
                getAuthErrorMessage(error)
            );


        } finally {

            emailLoginBtn.disabled =
                false;

            emailLoginBtn.textContent =
                "Login";

        }

    }
);


/* =====================================================
   CREATE ACCOUNT
===================================================== */

emailSignupBtn?.addEventListener(
    "click",
    async () => {

        showMessage("");


        const email =
            emailInput?.value.trim() || "";

        const password =
            passwordInput?.value || "";


        if (!email) {

            showMessage(
                "Enter your email address."
            );

            emailInput?.focus();

            return;

        }


        if (password.length < 6) {

            showMessage(
                "Password must contain at least 6 characters."
            );

            passwordInput?.focus();

            return;

        }


        emailSignupBtn.disabled =
            true;

        emailSignupBtn.textContent =
            "Creating...";


        try {

            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


            if (emailInput) {
                emailInput.value = "";
            }

            if (passwordInput) {
                passwordInput.value = "";
            }


        } catch (error) {

            console.error(
                "Create Account Error:",
                error
            );


            showMessage(
                getAuthErrorMessage(error)
            );


        } finally {

            emailSignupBtn.disabled =
                false;

            emailSignupBtn.textContent =
                "Create New Account";

        }

    }
);


/* =====================================================
   FORGOT PASSWORD
===================================================== */

forgotPasswordBtn?.addEventListener(
    "click",
    async () => {

        showMessage("");


        const email =
            emailInput?.value.trim() || "";


        if (!email) {

            showMessage(
                "Enter your email first."
            );

            emailInput?.focus();

            return;

        }


        forgotPasswordBtn.disabled =
            true;

        forgotPasswordBtn.textContent =
            "Sending...";


        try {

            await sendPasswordResetEmail(
                auth,
                email
            );


            showMessage(
                "Password reset email has been sent.",
                "success"
            );


        } catch (error) {

            console.error(
                "Password Reset Error:",
                error
            );


            showMessage(
                getAuthErrorMessage(error)
            );


        } finally {

            forgotPasswordBtn.disabled =
                false;

            forgotPasswordBtn.textContent =
                "Forgot Password?";

        }

    }
);


/* =====================================================
   AUTH STATE
===================================================== */

onAuthStateChanged(
    auth,
    async user => {

        console.log(
            "Firebase Auth:",
            user
                ? user.email
                : "Logged Out"
        );


        if (user) {

            currentUser =
                user;


            showDiaryPage();

            showUser(user);

            await loadNotes();


        } else {

            currentUser =
                null;

            notes = [];

            editingNoteId =
                null;

            viewingNoteId =
                null;


            showLoginPage();

            renderNotes();

        }

    }
);


/* =====================================================
   SHOW USER
===================================================== */

function showUser(user) {

    if (!userEmail) {
        return;
    }


    if (user.displayName) {

        userEmail.textContent =
            user.displayName;

    } else if (user.email) {

        userEmail.textContent =
            user.email;

    } else {

        userEmail.textContent =
            "Welcome";

    }

}


/* =====================================================
   LOGOUT
===================================================== */

logoutBtn?.addEventListener(
    "click",
    async () => {

        logoutBtn.disabled =
            true;

        logoutBtn.textContent =
            "Logging out...";


        try {

            await signOut(auth);

        } catch (error) {

            console.error(
                "Logout Error:",
                error
            );

        } finally {

            logoutBtn.disabled =
                false;

            logoutBtn.textContent =
                "Logout";

        }

    }
);


/* =====================================================
   FIRESTORE COLLECTION
===================================================== */

function notesCollection() {

    if (!currentUser) {
        return null;
    }


    return collection(
        db,
        "users",
        currentUser.uid,
        "notes"
    );

}


/* =====================================================
   LOAD NOTES
===================================================== */

async function loadNotes() {

    if (!currentUser) {

        notes = [];

        renderNotes();

        return;

    }


    try {

        const notesRef =
            notesCollection();


        if (!notesRef) {
            return;
        }


        const q =
            query(
                notesRef,
                orderBy(
                    "updatedAt",
                    "desc"
                )
            );


        const snapshot =
            await getDocs(q);


        notes = [];


        snapshot.forEach(
            item => {

                const data =
                    item.data();


                notes.push({

                    id:
                        item.id,

                    title:
                        data.title || "",

                    content:
                        data.content || "",

                    mood:
                        data.mood || "😊",

                    color:
                        data.color || "blue",

                    favorite:
                        Boolean(
                            data.favorite
                        ),

                    pinned:
                        Boolean(
                            data.pinned
                        ),

                    createdAt:
                        timestampToMillis(
                            data.createdAt
                        ),

                    updatedAt:
                        timestampToMillis(
                            data.updatedAt
                        )

                });

            }
        );


        renderNotes();


    } catch (error) {

        console.error(
            "Load Notes Error:",
            error
        );


        notes = [];

        renderNotes();

    }

}


/* =====================================================
   TIMESTAMP
===================================================== */

function timestampToMillis(timestamp) {

    if (
        timestamp &&
        typeof timestamp.toMillis ===
        "function"
    ) {

        return timestamp.toMillis();

    }


    return Date.now();

}


/* =====================================================
   OPEN NEW NOTE
===================================================== */

function openNewNote() {

    if (!currentUser) {

        return;

    }


    editingNoteId =
        null;


    noteModalTitle.textContent =
        "New Note";


    noteTitleInput.value =
        "";

    noteContentInput.value =
        "";

    noteMoodInput.value =
        "😊";

    noteColorInput.value =
        "blue";


    noteModal.classList.remove(
        "hidden"
    );


    setTimeout(
        () => {

            noteTitleInput?.focus();

        },
        100
    );

}


/* =====================================================
   OPEN EDIT NOTE
===================================================== */

function openEditNote(id) {

    const note =
        notes.find(
            item =>
                item.id === id
        );


    if (!note) {
        return;
    }


    editingNoteId =
        id;


    noteModalTitle.textContent =
        "Edit Note";


    noteTitleInput.value =
        note.title;

    noteContentInput.value =
        note.content;

    noteMoodInput.value =
        note.mood;

    noteColorInput.value =
        note.color;


    noteModal.classList.remove(
        "hidden"
    );

}


/* =====================================================
   CLOSE NOTE MODAL
===================================================== */

function closeNoteModalWindow() {

    noteModal?.classList.add(
        "hidden"
    );

    editingNoteId =
        null;

}


/* =====================================================
   SAVE NOTE
===================================================== */

saveNoteBtn?.addEventListener(
    "click",
    async () => {

        if (!currentUser) {
            return;
        }


        const title =
            noteTitleInput.value.trim();

        const content =
            noteContentInput.value.trim();

        const mood =
            noteMoodInput.value;

        const color =
            noteColorInput.value;


        if (!title && !content) {

            alert(
                "Please write something first."
            );

            return;

        }


        saveNoteBtn.disabled =
            true;

        saveNoteBtn.textContent =
            "Saving...";


        try {

            if (editingNoteId) {

                const noteRef =
                    doc(
                        db,
                        "users",
                        currentUser.uid,
                        "notes",
                        editingNoteId
                    );


                await updateDoc(
                    noteRef,
                    {

                        title:
                            title,

                        content:
                            content,

                        mood:
                            mood,

                        color:
                            color,

                        updatedAt:
                            serverTimestamp()

                    }
                );


            } else {

                const notesRef =
                    notesCollection();


                await addDoc(
                    notesRef,
                    {

                        title:
                            title,

                        content:
                            content,

                        mood:
                            mood,

                        color:
                            color,

                        favorite:
                            false,

                        pinned:
                            false,

                        createdAt:
                            serverTimestamp(),

                        updatedAt:
                            serverTimestamp()

                    }
                );

            }


            closeNoteModalWindow();

            await loadNotes();


        } catch (error) {

            console.error(
                "Save Note Error:",
                error
            );


            alert(
                "Unable to save the note."
            );

        } finally {

            saveNoteBtn.disabled =
                false;

            saveNoteBtn.textContent =
                "Save Note";

        }

    }
);


/* =====================================================
   DELETE NOTE
===================================================== */

async function deleteNote(id) {

    if (!currentUser) {
        return;
    }


    const confirmed =
        confirm(
            "Delete this note?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "users",
                currentUser.uid,
                "notes",
                id
            )
        );


        viewingNoteId =
            null;


        viewNoteModal?.classList.add(
            "hidden"
        );


        await loadNotes();


    } catch (error) {

        console.error(
            "Delete Note Error:",
            error
        );


        alert(
            "Unable to delete this note."
        );

    }

}


/* =====================================================
   FAVORITE
===================================================== */

async function toggleFavorite(id) {

    if (!currentUser) {
        return;
    }


    const note =
        notes.find(
            item =>
                item.id === id
        );


    if (!note) {
        return;
    }


    try {

        await updateDoc(
            doc(
                db,
                "users",
                currentUser.uid,
                "notes",
                id
            ),
            {

                favorite:
                    !note.favorite,

                updatedAt:
                    serverTimestamp()

            }
        );


        await loadNotes();


    } catch (error) {

        console.error(
            "Favorite Error:",
            error
        );

    }

}


/* =====================================================
   PIN
===================================================== */

async function togglePin(id) {

    if (!currentUser) {
        return;
    }


    const note =
        notes.find(
            item =>
                item.id === id
        );


    if (!note) {
        return;
    }


    try {

        await updateDoc(
            doc(
                db,
                "users",
                currentUser.uid,
                "notes",
                id
            ),
            {

                pinned:
                    !note.pinned,

                updatedAt:
                    serverTimestamp()

            }
        );


        await loadNotes();


    } catch (error) {

        console.error(
            "Pin Error:",
            error
        );

    }

}


/* =====================================================
   RENDER NOTES
===================================================== */

function renderNotes() {

    if (!notesList) {
        return;
    }


    const cards =
        notesList.querySelectorAll(
            ".note-card"
        );


    cards.forEach(
        card =>
            card.remove()
    );


    let filtered =
        [...notes];


    /* FILTER */

    if (
        currentFilter ===
        "favorite"
    ) {

        filtered =
            filtered.filter(
                note =>
                    note.favorite
            );

    }


    if (
        currentFilter ===
        "pinned"
    ) {

        filtered =
            filtered.filter(
                note =>
                    note.pinned
            );

    }


    /* SEARCH */

    if (searchText) {

        filtered =
            filtered.filter(
                note => {

                    const title =
                        note.title
                            .toLowerCase();

                    const content =
                        note.content
                            .toLowerCase();


                    return (
                        title.includes(
                            searchText
                        )
                        ||
                        content.includes(
                            searchText
                        )
                    );

                }
            );

    }


    if (
        filtered.length === 0
    ) {

        emptyNotes?.classList.remove(
            "hidden"
        );


    } else {

        emptyNotes?.classList.add(
            "hidden"
        );


        filtered.forEach(
            note => {

                notesList.appendChild(
                    createNoteCard(
                        note
                    )
                );

            }
        );

    }


    updateStats();

}


/* =====================================================
   CREATE NOTE CARD
===================================================== */

function createNoteCard(note) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "note-card";


    card.dataset.color =
        note.color;


    const safeTitle =
        escapeHtml(
            note.title ||
            "Untitled Note"
        );


    const safeContent =
        escapeHtml(
            note.content ||
            "No content"
        );


    const preview =
        safeContent.length > 150
            ? safeContent.substring(
                0,
                150
            ) + "..."
            : safeContent;


    card.innerHTML = `

        <div class="note-top">

            <span class="note-mood">
                ${escapeHtml(note.mood)}
            </span>

            <div class="note-actions">

                <button
                    class="note-action favorite-button"
                    type="button"
                    aria-label="Favorite"
                >
                    ${note.favorite ? "⭐" : "☆"}
                </button>

                <button
                    class="note-action pin-button"
                    type="button"
                    aria-label="Pin"
                >
                    ${note.pinned ? "📌" : "📍"}
                </button>

            </div>

        </div>


        <h3 class="note-title">
            ${safeTitle}
        </h3>


        <p class="note-preview">
            ${preview}
        </p>


        <div class="note-bottom">

            <span class="note-date">
                ${formatDate(
                    note.updatedAt
                )}
            </span>

            <button
                class="view-btn"
                type="button"
            >
                View
            </button>

        </div>

    `;


    const favoriteButton =
        card.querySelector(
            ".favorite-button"
        );

    const pinButton =
        card.querySelector(
            ".pin-button"
        );

    const viewButton =
        card.querySelector(
            ".view-btn"
        );


    favoriteButton?.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            toggleFavorite(
                note.id
            );

        }
    );


    pinButton?.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            togglePin(
                note.id
            );

        }
    );


    viewButton?.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            openViewNote(
                note.id
            );

        }
    );


    card.addEventListener(
        "click",
        () => {

            openViewNote(
                note.id
            );

        }
    );


    return card;

}


/* =====================================================
   VIEW NOTE
===================================================== */

function openViewNote(id) {

    const note =
        notes.find(
            item =>
                item.id === id
        );


    if (!note) {
        return;
    }


    viewingNoteId =
        id;


    viewNoteTitle.textContent =
        note.title ||
        "Untitled Note";


    viewNoteMood.textContent =
        note.mood;


    viewNoteContent.textContent =
        note.content ||
        "No content";


    viewNoteDate.textContent =
        formatDate(
            note.updatedAt
        );


    viewNoteModal.classList.remove(
        "hidden"
    );

}


/* =====================================================
   STATISTICS
===================================================== */

function updateStats() {

    if (totalNotes) {

        totalNotes.textContent =
            notes.length;

    }


    if (favoriteNotes) {

        favoriteNotes.textContent =
            notes.filter(
                note =>
                    note.favorite
            ).length;

    }


    if (pinnedNotes) {

        pinnedNotes.textContent =
            notes.filter(
                note =>
                    note.pinned
            ).length;

    }

}


/* =====================================================
   DATE
===================================================== */

function formatDate(timestamp) {

    if (!timestamp) {
        return "";
    }


    return new Date(
        timestamp
    ).toLocaleString(
        "en-IN",
        {

            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"

        }
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   NEW NOTE BUTTONS
===================================================== */

newNoteBtn?.addEventListener(
    "click",
    openNewNote
);

addNoteBtn?.addEventListener(
    "click",
    openNewNote
);

addNoteBtn2?.addEventListener(
    "click",
    openNewNote
);

emptyAddNoteBtn?.addEventListener(
    "click",
    openNewNote
);


/* =====================================================
   CLOSE NOTE MODAL
===================================================== */

closeNoteModal?.addEventListener(
    "click",
    closeNoteModalWindow
);

cancelNoteBtn?.addEventListener(
    "click",
    closeNoteModalWindow
);


/* =====================================================
   CLOSE VIEW MODAL
===================================================== */

closeViewNoteModal?.addEventListener(
    "click",
    () => {

        viewNoteModal?.classList.add(
            "hidden"
        );

        viewingNoteId =
            null;

    }
);


/* =====================================================
   EDIT NOTE
===================================================== */

editNoteBtn?.addEventListener(
    "click",
    () => {

        if (!viewingNoteId) {
            return;
        }


        viewNoteModal?.classList.add(
            "hidden"
        );


        openEditNote(
            viewingNoteId
        );

    }
);


/* =====================================================
   DELETE NOTE
===================================================== */

deleteNoteBtn?.addEventListener(
    "click",
    () => {

        if (!viewingNoteId) {
            return;
        }


        deleteNote(
            viewingNoteId
        );

    }
);


/* =====================================================
   SEARCH
===================================================== */

noteSearchInput?.addEventListener(
    "input",
    () => {

        searchText =
            noteSearchInput.value
                .trim()
                .toLowerCase();


        renderNotes();

    }
);


/* =====================================================
   FILTER
===================================================== */

function setFilter(filter) {

    currentFilter =
        filter;


    allNotesFilter?.classList.remove(
        "active"
    );

    favoriteFilter?.classList.remove(
        "active"
    );

    pinnedFilter?.classList.remove(
        "active"
    );


    if (filter === "all") {

        allNotesFilter?.classList.add(
            "active"
        );

    }


    if (filter === "favorite") {

        favoriteFilter?.classList.add(
            "active"
        );

    }


    if (filter === "pinned") {

        pinnedFilter?.classList.add(
            "active"
        );

    }


    renderNotes();

}


allNotesFilter?.addEventListener(
    "click",
    () =>
        setFilter("all")
);

favoriteFilter?.addEventListener(
    "click",
    () =>
        setFilter("favorite")
);

pinnedFilter?.addEventListener(
    "click",
    () =>
        setFilter("pinned")
);


/* =====================================================
   QUICK SEARCH
===================================================== */

document
    .getElementById(
        "searchNotesBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            setFilter("all");


            document
                .getElementById(
                    "notesSection"
                )
                ?.scrollIntoView({
                    behavior:
                        "smooth"
                });


            setTimeout(
                () => {

                    noteSearchInput?.focus();

                },
                400
            );

        }
    );


/* =====================================================
   QUICK FAVORITES
===================================================== */

document
    .getElementById(
        "favoritesBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            setFilter(
                "favorite"
            );


            document
                .getElementById(
                    "notesSection"
                )
                ?.scrollIntoView({
                    behavior:
                        "smooth"
                });

        }
    );


/* =====================================================
   QUICK PINNED
===================================================== */

document
    .getElementById(
        "pinnedBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            setFilter(
                "pinned"
            );


            document
                .getElementById(
                    "notesSection"
                )
                ?.scrollIntoView({
                    behavior:
                        "smooth"
                });

        }
    );


/* =====================================================
   OUTSIDE CLICK — NOTE MODAL
===================================================== */

noteModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            noteModal
        ) {

            closeNoteModalWindow();

        }

    }
);


/* =====================================================
   OUTSIDE CLICK — VIEW MODAL
===================================================== */

viewNoteModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            viewNoteModal
        ) {

            viewNoteModal.classList.add(
                "hidden"
            );

            viewingNoteId =
                null;

        }

    }
);


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        noteModal?.classList.add(
            "hidden"
        );

        viewNoteModal?.classList.add(
            "hidden"
        );


        editingNoteId =
            null;

        viewingNoteId =
            null;

    }
);


/* =====================================================
   INITIAL PAGE
===================================================== */

showLoginPage();


console.log(
    "🦁 LeoDiary initialized successfully."
);
