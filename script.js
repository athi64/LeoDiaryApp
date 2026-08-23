/* =====================================================
   LeoDiary - Complete JavaScript
   Firebase Authentication + Firestore
   No Automatic Login After Refresh
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
   IMPORTANT
   LOGIN SESSION WILL NOT BE SAVED AFTER PAGE REFRESH
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
   NOTE BUTTONS
===================================================== */

const newNoteBtn =
    document.getElementById("newNoteBtn");

const addNoteBtn =
    document.getElementById("addNoteBtn");

const addNoteBtn2 =
    document.getElementById("addNoteBtn2");

const emptyAddNoteBtn =
    document.getElementById("emptyAddNoteBtn");


/* =====================================================
   NOTES
===================================================== */

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
   VIEW NOTE MODAL
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
   SHOW / HIDE PAGE
===================================================== */

function showLoginPage() {

    if (loginPage) {
        loginPage.classList.remove("hidden");
    }

    if (diaryPage) {
        diaryPage.classList.add("hidden");
    }

}


function showDiaryPage() {

    if (loginPage) {
        loginPage.classList.add("hidden");
    }

    if (diaryPage) {
        diaryPage.classList.remove("hidden");
    }

}


/* =====================================================
   AUTH ERROR
===================================================== */

function authError(error) {

    const code =
        error?.code || "";


    const messages = {

        "auth/invalid-email":
            "Enter a valid email address.",

        "auth/weak-password":
            "Password must contain at least 6 characters.",

        "auth/email-already-in-use":
            "This email is already registered.",

        "auth/invalid-credential":
            "Incorrect email or password.",

        "auth/user-not-found":
            "No account found with this email.",

        "auth/wrong-password":
            "Incorrect password.",

        "auth/popup-closed-by-user":
            "Google login was cancelled.",

        "auth/popup-blocked":
            "Google popup was blocked.",

        "auth/unauthorized-domain":
            "This website is not authorized in Firebase.",

        "auth/network-request-failed":
            "Network error. Check your internet.",

        "auth/too-many-requests":
            "Too many attempts. Try again later.",

        "auth/operation-not-allowed":
            "This login method is not enabled in Firebase.",

        "auth/account-exists-with-different-credential":
            "An account already exists with another login method."

    };


    return (
        messages[code] ||
        "Something went wrong. Please try again."
    );
}


/* =====================================================
   SHOW ERROR
===================================================== */

function showError(message) {

    if (emailError) {

        emailError.textContent =
            message || "";

    }

}


/* =====================================================
   GOOGLE LOGIN
===================================================== */

googleLoginBtn?.addEventListener(
    "click",
    async () => {

        showError("");

        googleLoginBtn.disabled =
            true;

        googleLoginBtn.innerHTML = `
            <span>Signing in...</span>
        `;


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

            showError(
                authError(error)
            );


            googleLoginBtn.disabled =
                false;

            googleLoginBtn.innerHTML = `
                <span class="google-letter">G</span>
                <span>Continue with Google</span>
            `;

        }

    }
);


/* =====================================================
   EMAIL LOGIN
===================================================== */

emailLoginBtn?.addEventListener(
    "click",
    async () => {

        showError("");

        const email =
            emailInput?.value.trim() || "";

        const password =
            passwordInput?.value || "";


        if (!email) {

            showError(
                "Enter your email."
            );

            return;

        }


        if (!password) {

            showError(
                "Enter your password."
            );

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

            showError(
                authError(error)
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

        showError("");

        const email =
            emailInput?.value.trim() || "";

        const password =
            passwordInput?.value || "";


        if (!email) {

            showError(
                "Enter your email."
            );

            return;

        }


        if (password.length < 6) {

            showError(
                "Password must contain at least 6 characters."
            );

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

            showError(
                authError(error)
            );


        } finally {

            emailSignupBtn.disabled =
                false;

            emailSignupBtn.textContent =
                "Create Account";

        }

    }
);


/* =====================================================
   FORGOT PASSWORD
===================================================== */

forgotPasswordBtn?.addEventListener(
    "click",
    async () => {

        showError("");

        const email =
            emailInput?.value.trim() || "";


        if (!email) {

            showError(
                "Enter your email first."
            );

            return;

        }


        forgotPasswordBtn.disabled =
            true;


        try {

            await sendPasswordResetEmail(
                auth,
                email
            );


            showError(
                "Password reset email sent."
            );


        } catch (error) {

            console.error(
                "Password Reset Error:",
                error
            );

            showError(
                authError(error)
            );


        } finally {

            forgotPasswordBtn.disabled =
                false;

        }

    }
);


/* =====================================================
   AUTH STATE
===================================================== */

onAuthStateChanged(
    auth,
    async (user) => {

        console.log(
            "Firebase Auth State:",
            user ? user.email : "Logged Out"
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

        const q =
            query(
                notesCollection(),
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

        showError(
            "Please login first."
        );

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

            noteTitleInput.focus();

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

            alert(
                "Please login first."
            );

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

                await addDoc(
                    notesCollection(),
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
                "Unable to save note. Check Firestore rules."
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


    const note =
        notes.find(
            item =>
                item.id === id
        );


    if (!note) {
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


        viewNoteModal.classList.add(
            "hidden"
        );


        await loadNotes();


    } catch (error) {

        console.error(
            "Delete Note Error:",
            error
        );


        alert(
            "Unable to delete note."
        );

    }

}


/* =====================================================
   TOGGLE FAVORITE
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
   TOGGLE PIN
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


    const oldCards =
        notesList.querySelectorAll(
            ".note-card"
        );


    oldCards.forEach(
        card => card.remove()
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

        const search =
            searchText.toLowerCase();


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
                            search
                        )
                        ||
                        content.includes(
                            search
                        )
                    );

                }
            );

    }


    /* EMPTY */

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


    const title =
        escapeHtml(
            note.title ||
            "Untitled Note"
        );


    const content =
        escapeHtml(
            note.content ||
            "No content"
        );


    const preview =
        content.length > 150
            ? content.substring(
                0,
                150
              ) + "..."
            : content;


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
            ${title}
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

        viewNoteModal.classList.add(
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


        viewNoteModal.classList.add(
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
    () => setFilter("all")
);


favoriteFilter?.addEventListener(
    "click",
    () => setFilter("favorite")
);


pinnedFilter?.addEventListener(
    "click",
    () => setFilter("pinned")
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
                500
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
   OUTSIDE CLICK - NOTE MODAL
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
   OUTSIDE CLICK - VIEW MODAL
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
   ESCAPE KEY
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
   ENTER = LOGIN
===================================================== */

passwordInput?.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            event.preventDefault();

            emailLoginBtn?.click();

        }

    }
);


/* =====================================================
   INITIAL PAGE
===================================================== */

/*
   Until Firebase checks authentication,
   show LOGIN page.
*/

showLoginPage();


console.log(
    "LeoDiary Firebase initialized successfully."
);
