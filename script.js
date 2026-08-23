/* =========================================================
   LeoDiary - COMPLETE SCRIPT
   Firebase Authentication + Firestore
========================================================= */


/* =========================================================
   FIREBASE IMPORTS
========================================================= */

import {
    initializeApp
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";


import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


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
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


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

const app =
    initializeApp(firebaseConfig);


const auth =
    getAuth(app);


const db =
    getFirestore(app);


/* =========================================================
   GOOGLE PROVIDER
========================================================= */

const googleProvider =
    new GoogleAuthProvider();


googleProvider.setCustomParameters({
    prompt: "select_account"
});


/* =========================================================
   HTML ELEMENTS
========================================================= */

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


/* =========================================================
   DIARY ELEMENTS
========================================================= */

const newNoteBtn =
    document.getElementById("newNoteBtn");


const addNoteBtn =
    document.getElementById("addNoteBtn");


const emptyAddNoteBtn =
    document.getElementById("emptyAddNoteBtn");


const searchNotesBtn =
    document.getElementById("searchNotesBtn");


const favoritesBtn =
    document.getElementById("favoritesBtn");


const pinnedBtn =
    document.getElementById("pinnedBtn");


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


/* =========================================================
   STATISTICS
========================================================= */

const totalNotes =
    document.getElementById("totalNotes");


const favoriteNotes =
    document.getElementById("favoriteNotes");


const pinnedNotes =
    document.getElementById("pinnedNotes");


/* =========================================================
   NOTE MODAL
========================================================= */

const noteModal =
    document.getElementById("noteModal");


const closeNoteModal =
    document.getElementById("closeNoteModal");


const noteModalTitle =
    document.getElementById("noteModalTitle");


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


/* =========================================================
   VIEW NOTE MODAL
========================================================= */

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


/* =========================================================
   APPLICATION STATE
========================================================= */

let currentUser =
    null;


let notes =
    [];


let currentEditingNoteId =
    null;


let currentViewingNoteId =
    null;


let currentFilter =
    "all";


let searchText =
    "";


/* =========================================================
   LOCAL STORAGE KEY
========================================================= */

function getLocalStorageKey() {

    if (!currentUser) {

        return "leoDiaryNotes_guest";

    }

    return (
        "leoDiaryNotes_" +
        currentUser.uid
    );

}


/* =========================================================
   SAVE LOCAL BACKUP
========================================================= */

function saveLocalBackup() {

    try {

        localStorage.setItem(
            getLocalStorageKey(),
            JSON.stringify(notes)
        );

    } catch (error) {

        console.error(
            "Local backup error:",
            error
        );

    }

}


/* =========================================================
   LOAD LOCAL BACKUP
========================================================= */

function loadLocalBackup() {

    try {

        const data =
            localStorage.getItem(
                getLocalStorageKey()
            );


        if (!data) {

            return [];

        }


        const parsed =
            JSON.parse(data);


        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "Local load error:",
            error
        );

        return [];

    }

}


/* =========================================================
   ERROR MESSAGE
========================================================= */

function getAuthErrorMessage(error) {

    const code =
        error?.code || "";


    switch (code) {

        case "auth/invalid-email":

            return "Please enter a valid email address.";


        case "auth/missing-password":

            return "Please enter your password.";


        case "auth/weak-password":

            return "Password must be at least 6 characters.";


        case "auth/email-already-in-use":

            return "This email is already registered.";


        case "auth/invalid-credential":

            return "Incorrect email or password.";


        case "auth/user-not-found":

            return "No account found with this email.";


        case "auth/wrong-password":

            return "Incorrect password.";


        case "auth/popup-closed-by-user":

            return "Google sign-in was cancelled.";


        case "auth/popup-blocked":

            return "Google login popup was blocked. Allow popups and try again.";


        case "auth/unauthorized-domain":

            return "This website domain is not authorized in Firebase.";


        case "auth/network-request-failed":

            return "Network error. Check your internet connection.";


        case "auth/too-many-requests":

            return "Too many attempts. Please try again later.";


        default:

            return (
                error?.message ||
                "Something went wrong. Please try again."
            );

    }

}


/* =========================================================
   SHOW EMAIL ERROR
========================================================= */

function showEmailError(message) {

    if (!emailError) {

        return;

    }

    emailError.textContent =
        message || "";

}


/* =========================================================
   GOOGLE LOGIN
========================================================= */

if (googleLoginBtn) {

    googleLoginBtn.addEventListener(
        "click",
        async () => {

            showEmailError("");

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
                    "Google login error:",
                    error
                );


                showEmailError(
                    getAuthErrorMessage(
                        error
                    )
                );


                googleLoginBtn.disabled =
                    false;


                googleLoginBtn.innerHTML = `
                    <span class="google-icon">
                        G
                    </span>

                    <span>
                        Continue with Google
                    </span>
                `;

            }

        }
    );

}


/* =========================================================
   EMAIL LOGIN
========================================================= */

if (emailLoginBtn) {

    emailLoginBtn.addEventListener(
        "click",
        async () => {

            showEmailError("");

            const email =
                emailInput.value.trim();


            const password =
                passwordInput.value;


            if (!email) {

                showEmailError(
                    "Please enter your email."
                );

                emailInput.focus();

                return;

            }


            if (!password) {

                showEmailError(
                    "Please enter your password."
                );

                passwordInput.focus();

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


                emailInput.value =
                    "";

                passwordInput.value =
                    "";


            } catch (error) {

                console.error(
                    "Email login error:",
                    error
                );


                showEmailError(
                    getAuthErrorMessage(
                        error
                    )
                );


                emailLoginBtn.disabled =
                    false;


                emailLoginBtn.textContent =
                    "Login";

            }

        }
    );

}


/* =========================================================
   CREATE ACCOUNT
========================================================= */

if (emailSignupBtn) {

    emailSignupBtn.addEventListener(
        "click",
        async () => {

            showEmailError("");

            const email =
                emailInput.value.trim();


            const password =
                passwordInput.value;


            if (!email) {

                showEmailError(
                    "Please enter your email."
                );

                emailInput.focus();

                return;

            }


            if (!password) {

                showEmailError(
                    "Please enter a password."
                );

                passwordInput.focus();

                return;

            }


            if (password.length < 6) {

                showEmailError(
                    "Password must be at least 6 characters."
                );

                return;

            }


            emailSignupBtn.disabled =
                true;


            emailSignupBtn.textContent =
                "Creating account...";


            try {

                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                emailInput.value =
                    "";

                passwordInput.value =
                    "";


            } catch (error) {

                console.error(
                    "Signup error:",
                    error
                );


                showEmailError(
                    getAuthErrorMessage(
                        error
                    )
                );


                emailSignupBtn.disabled =
                    false;


                emailSignupBtn.textContent =
                    "Create Account";

            }

        }
    );

}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

if (forgotPasswordBtn) {

    forgotPasswordBtn.addEventListener(
        "click",
        async () => {

            showEmailError("");

            const email =
                emailInput.value.trim();


            if (!email) {

                showEmailError(
                    "Enter your email first."
                );

                emailInput.focus();

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


                showEmailError(
                    "Password reset email sent. Check your inbox."
                );


            } catch (error) {

                console.error(
                    "Password reset error:",
                    error
                );


                showEmailError(
                    getAuthErrorMessage(
                        error
                    )
                );

            }


            forgotPasswordBtn.disabled =
                false;


            forgotPasswordBtn.textContent =
                "Forgot Password?";

        }
    );

}


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
    auth,
    async user => {

        if (user) {

            currentUser =
                user;


            loginPage?.classList.add(
                "hidden"
            );


            diaryPage?.classList.remove(
                "hidden"
            );


            updateUserInformation(
                user
            );


            await loadNotes();

        } else {

            currentUser =
                null;


            notes =
                [];


            diaryPage?.classList.add(
                "hidden"
            );


            loginPage?.classList.remove(
                "hidden"
            );

        }

    }
);


/* =========================================================
   USER INFORMATION
========================================================= */

function updateUserInformation(user) {

    if (!userEmail) {

        return;

    }


    if (user.displayName) {

        userEmail.textContent =
            "Welcome, " +
            user.displayName;

        return;

    }


    if (user.email) {

        userEmail.textContent =
            user.email;

        return;

    }


    if (user.phoneNumber) {

        userEmail.textContent =
            user.phoneNumber;

        return;

    }


    userEmail.textContent =
        "Welcome to LeoDiary";

}


/* =========================================================
   USER NOTES COLLECTION
========================================================= */

function getNotesCollection() {

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


/* =========================================================
   LOAD NOTES
========================================================= */

async function loadNotes() {

    if (!currentUser) {

        return;

    }


    notes =
        loadLocalBackup();


    renderNotes();


    try {

        const notesCollection =
            getNotesCollection();


        if (!notesCollection) {

            return;

        }


        const q =
            query(
                notesCollection,
                orderBy(
                    "updatedAt",
                    "desc"
                )
            );


        const snapshot =
            await getDocs(q);


        const cloudNotes = [];


        snapshot.forEach(
            item => {

                const data =
                    item.data();


                cloudNotes.push({

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
                        convertTimestamp(
                            data.createdAt
                        ),

                    updatedAt:
                        convertTimestamp(
                            data.updatedAt
                        )

                });

            }
        );


        notes =
            cloudNotes;


        saveLocalBackup();

        renderNotes();


    } catch (error) {

        console.error(
            "Load notes error:",
            error
        );


        /*
            Local backup remains available.
        */

        renderNotes();

    }

}


/* =========================================================
   CONVERT FIREBASE TIMESTAMP
========================================================= */

function convertTimestamp(timestamp) {

    if (!timestamp) {

        return Date.now();

    }


    if (
        typeof timestamp.toMillis ===
        "function"
    ) {

        return timestamp.toMillis();

    }


    return Date.now();

}


/* =========================================================
   OPEN NEW NOTE
========================================================= */

function openNewNote() {

    currentEditingNoteId =
        null;


    if (noteModalTitle) {

        noteModalTitle.textContent =
            "New Note";

    }


    if (noteTitleInput) {

        noteTitleInput.value =
            "";

    }


    if (noteContentInput) {

        noteContentInput.value =
            "";

    }


    if (noteMoodInput) {

        noteMoodInput.value =
            "😊";

    }


    if (noteColorInput) {

        noteColorInput.value =
            "blue";

    }


    noteModal?.classList.remove(
        "hidden"
    );


    setTimeout(
        () => {

            noteTitleInput?.focus();

        },
        100
    );

}


/* =========================================================
   OPEN EDIT NOTE
========================================================= */

function openEditNote(id) {

    const note =
        notes.find(
            item =>
                item.id === id
        );


    if (!note) {

        return;

    }


    currentEditingNoteId =
        id;


    noteModalTitle.textContent =
        "Edit Note";


    noteTitleInput.value =
        note.title || "";


    noteContentInput.value =
        note.content || "";


    noteMoodInput.value =
        note.mood || "😊";


    noteColorInput.value =
        note.color || "blue";


    noteModal.classList.remove(
        "hidden"
    );


    noteTitleInput.focus();

}


/* =========================================================
   CLOSE NOTE MODAL
========================================================= */

function closeNoteEditor() {

    noteModal?.classList.add(
        "hidden"
    );


    currentEditingNoteId =
        null;

}


/* =========================================================
   SAVE NOTE
========================================================= */

async function saveNote() {

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
            "Please enter a title or note content."
        );

        return;

    }


    saveNoteBtn.disabled =
        true;


    saveNoteBtn.textContent =
        "Saving...";


    try {

        const now =
            Date.now();


        if (currentEditingNoteId) {

            /*
                EDIT
            */

            const noteRef =
                doc(
                    db,
                    "users",
                    currentUser.uid,
                    "notes",
                    currentEditingNoteId
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


            const index =
                notes.findIndex(
                    item =>
                        item.id ===
                        currentEditingNoteId
                );


            if (index !== -1) {

                notes[index] = {

                    ...notes[index],

                    title,
                    content,
                    mood,
                    color,

                    updatedAt:
                        now

                };

            }

        } else {

            /*
                CREATE
            */

            const notesCollection =
                getNotesCollection();


            const docRef =
                await addDoc(
                    notesCollection,
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


            notes.unshift({

                id:
                    docRef.id,

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
                    now,

                updatedAt:
                    now

            });

        }


        saveLocalBackup();

        renderNotes();

        closeNoteEditor();


    } catch (error) {

        console.error(
            "Save note error:",
            error
        );


        alert(
            "Unable to save note. Please check Firebase Firestore."
        );

    }


    saveNoteBtn.disabled =
        false;


    saveNoteBtn.textContent =
        "Save Note";

}


/* =========================================================
   DELETE NOTE
========================================================= */

async function deleteNote(id) {

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
            `Delete "${note.title || "this note"}"?`
        );


    if (!confirmed) {

        return;

    }


    try {

        if (currentUser) {

            const noteRef =
                doc(
                    db,
                    "users",
                    currentUser.uid,
                    "notes",
                    id
                );


            await deleteDoc(
                noteRef
            );

        }


        notes =
            notes.filter(
                item =>
                    item.id !== id
            );


        saveLocalBackup();

        renderNotes();

        viewNoteModal?.classList.add(
            "hidden"
        );


    } catch (error) {

        console.error(
            "Delete note error:",
            error
        );


        alert(
            "Unable to delete this note."
        );

    }

}


/* =========================================================
   TOGGLE FAVORITE
========================================================= */

async function toggleFavorite(id) {

    const note =
        notes.find(
            item =>
                item.id === id
        );


    if (!note || !currentUser) {

        return;

    }


    const newValue =
        !note.favorite;


    try {

        const noteRef =
            doc(
                db,
                "users",
                currentUser.uid,
                "notes",
                id
            );


        await updateDoc(
            noteRef,
            {

                favorite:
                    newValue,

                updatedAt:
                    serverTimestamp()

            }
        );


        note.favorite =
            newValue;


        note.updatedAt =
            Date.now();


        saveLocalBackup();

        renderNotes();


    } catch (error) {

        console.error(
            "Favorite error:",
            error
        );

        alert(
            "Unable to update favorite."
        );

    }

}


/* =========================================================
   TOGGLE PIN
========================================================= */

async function togglePin(id) {

    const note =
        notes.find(
            item =>
                item.id === id
        );


    if (!note || !currentUser) {

        return;

    }


    const newValue =
        !note.pinned;


    try {

        const noteRef =
            doc(
                db,
                "users",
                currentUser.uid,
                "notes",
                id
            );


        await updateDoc(
            noteRef,
            {

                pinned:
                    newValue,

                updatedAt:
                    serverTimestamp()

            }
        );


        note.pinned =
            newValue;


        note.updatedAt =
            Date.now();


        saveLocalBackup();

        renderNotes();


    } catch (error) {

        console.error(
            "Pin error:",
            error
        );

        alert(
            "Unable to update pinned status."
        );

    }

}


/* =========================================================
   FILTER NOTES
========================================================= */

function getFilteredNotes() {

    let result =
        [...notes];


    if (
        currentFilter ===
        "favorite"
    ) {

        result =
            result.filter(
                note =>
                    note.favorite
            );

    }


    if (
        currentFilter ===
        "pinned"
    ) {

        result =
            result.filter(
                note =>
                    note.pinned
            );

    }


    if (searchText) {

        const search =
            searchText.toLowerCase();


        result =
            result.filter(
                note => {

                    return (

                        (note.title || "")
                            .toLowerCase()
                            .includes(search)

                        ||

                        (note.content || "")
                            .toLowerCase()
                            .includes(search)

                    );

                }
            );

    }


    result.sort(
        (a, b) => {

            if (
                a.pinned &&
                !b.pinned
            ) {

                return -1;

            }


            if (
                !a.pinned &&
                b.pinned
            ) {

                return 1;

            }


            return (
                (b.updatedAt || 0) -
                (a.updatedAt || 0)
            );

        }
    );


    return result;

}


/* =========================================================
   RENDER NOTES
========================================================= */

function renderNotes() {

    if (!notesList) {

        return;

    }


    const filtered =
        getFilteredNotes();


    const oldCards =
        notesList.querySelectorAll(
            ".note-card"
        );


    oldCards.forEach(
        card =>
            card.remove()
    );


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

                const card =
                    createNoteCard(
                        note
                    );


                notesList.appendChild(
                    card
                );

            }
        );

    }


    updateStatistics();

}


/* =========================================================
   CREATE NOTE CARD
========================================================= */

function createNoteCard(note) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "note-card";


    card.dataset.color =
        note.color || "blue";


    const safeTitle =
        escapeHtml(
            note.title ||
            "Untitled Note"
        );


    const safeContent =
        escapeHtml(
            note.content ||
            ""
        );


    const preview =
        safeContent.length > 160
            ? safeContent.slice(0, 160) + "..."
            : safeContent;


    const date =
        formatDate(
            note.updatedAt
        );


    card.innerHTML = `

        <div class="note-card-top">

            <span class="note-mood">
                ${escapeHtml(note.mood || "😊")}
            </span>

            <div class="note-card-actions">

                <button
                    class="icon-btn favorite-note-btn"
                    title="Favorite"
                    type="button"
                >
                    ${note.favorite ? "⭐" : "☆"}
                </button>

                <button
                    class="icon-btn pin-note-btn"
                    title="Pin"
                    type="button"
                >
                    ${note.pinned ? "📌" : "📍"}
                </button>

            </div>

        </div>


        <h3 class="note-card-title">
            ${safeTitle}
        </h3>


        <p class="note-card-preview">
            ${preview}
        </p>


        <div class="note-card-bottom">

            <small>
                ${date}
            </small>

            <button
                class="view-note-btn"
                type="button"
            >
                View
            </button>

        </div>

    `;


    const favoriteBtn =
        card.querySelector(
            ".favorite-note-btn"
        );


    favoriteBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            toggleFavorite(
                note.id
            );

        }
    );


    const pinBtn =
        card.querySelector(
            ".pin-note-btn"
        );


    pinBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            togglePin(
                note.id
            );

        }
    );


    const viewBtn =
        card.querySelector(
            ".view-note-btn"
        );


    viewBtn.addEventListener(
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


/* =========================================================
   OPEN VIEW NOTE
========================================================= */

function openViewNote(id) {

    const note =
        notes.find(
            item =>
                item.id === id
        );


    if (!note) {

        return;

    }


    currentViewingNoteId =
        id;


    viewNoteTitle.textContent =
        note.title ||
        "Untitled Note";


    viewNoteMood.textContent =
        note.mood || "😊";


    viewNoteContent.textContent =
        note.content ||
        "No content";


    viewNoteDate.textContent =
        formatDate(
            note.updatedAt
        );


    viewNoteModal?.classList.remove(
        "hidden"
    );

}


/* =========================================================
   UPDATE STATISTICS
========================================================= */

function updateStatistics() {

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


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(timestamp) {

    if (!timestamp) {

        return "";

    }


    try {

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

    } catch (error) {

        return "";

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

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


/* =========================================================
   FILTER BUTTON UI
========================================================= */

function setActiveFilter(
    filter
) {

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


    if (
        filter ===
        "all"
    ) {

        allNotesFilter?.classList.add(
            "active"
        );

    }


    if (
        filter ===
        "favorite"
    ) {

        favoriteFilter?.classList.add(
            "active"
        );

    }


    if (
        filter ===
        "pinned"
    ) {

        pinnedFilter?.classList.add(
            "active"
        );

    }


    renderNotes();

}


/* =========================================================
   BUTTON EVENTS
========================================================= */

newNoteBtn?.addEventListener(
    "click",
    openNewNote
);


addNoteBtn?.addEventListener(
    "click",
    openNewNote
);


emptyAddNoteBtn?.addEventListener(
    "click",
    openNewNote
);


closeNoteModal?.addEventListener(
    "click",
    closeNoteEditor
);


cancelNoteBtn?.addEventListener(
    "click",
    closeNoteEditor
);


saveNoteBtn?.addEventListener(
    "click",
    saveNote
);


/* =========================================================
   CLOSE VIEW MODAL
========================================================= */

closeViewNoteModal?.addEventListener(
    "click",
    () => {

        viewNoteModal?.classList.add(
            "hidden"
        );

    }
);


/* =========================================================
   EDIT VIEWED NOTE
========================================================= */

editNoteBtn?.addEventListener(
    "click",
    () => {

        if (
            currentViewingNoteId
        ) {

            viewNoteModal?.classList.add(
                "hidden"
            );


            openEditNote(
                currentViewingNoteId
            );

        }

    }
);


/* =========================================================
   DELETE VIEWED NOTE
========================================================= */

deleteNoteBtn?.addEventListener(
    "click",
    () => {

        if (
            currentViewingNoteId
        ) {

            deleteNote(
                currentViewingNoteId
            );

        }

    }
);


/* =========================================================
   SEARCH
========================================================= */

noteSearchInput?.addEventListener(
    "input",
    () => {

        searchText =
            noteSearchInput.value
                .trim();


        renderNotes();

    }
);


/* =========================================================
   SEARCH QUICK ACTION
========================================================= */

searchNotesBtn?.addEventListener(
    "click",
    () => {

        noteSearchInput?.focus();

        noteSearchInput?.scrollIntoView(
            {

                behavior:
                    "smooth",

                block:
                    "center"

            }
        );

    }
);


/* =========================================================
   FAVORITES QUICK ACTION
========================================================= */

favoritesBtn?.addEventListener(
    "click",
    () => {

        setActiveFilter(
            "favorite"
        );


        document
            .getElementById(
                "notesSection"
            )
            ?.scrollIntoView(
                {

                    behavior:
                        "smooth"

                }
            );

    }
);


/* =========================================================
   PINNED QUICK ACTION
========================================================= */

pinnedBtn?.addEventListener(
    "click",
    () => {

        setActiveFilter(
            "pinned"
        );


        document
            .getElementById(
                "notesSection"
            )
            ?.scrollIntoView(
                {

                    behavior:
                        "smooth"

                }
            );

    }
);


/* =========================================================
   FILTERS
========================================================= */

allNotesFilter?.addEventListener(
    "click",
    () => {

        setActiveFilter(
            "all"
        );

    }
);


favoriteFilter?.addEventListener(
    "click",
    () => {

        setActiveFilter(
            "favorite"
        );

    }
);


pinnedFilter?.addEventListener(
    "click",
    () => {

        setActiveFilter(
            "pinned"
        );

    }
);


/* =========================================================
   LOGOUT
========================================================= */

logoutBtn?.addEventListener(
    "click",
    async () => {

        try {

            await signOut(
                auth
            );

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

            alert(
                "Unable to logout. Please try again."
            );

        }

    }
);


/* =========================================================
   CLOSE MODALS BY OUTSIDE CLICK
========================================================= */

noteModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            noteModal
        ) {

            closeNoteEditor();

        }

    }
);


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

        }

    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        if (
            !noteModal?.classList.contains(
                "hidden"
            )
        ) {

            closeNoteEditor();

        }


        if (
            !viewNoteModal?.classList.contains(
                "hidden"
            )
        ) {

            viewNoteModal.classList.add(
                "hidden"
            );

        }

    }
);


/* =========================================================
   PASSWORD ENTER KEY
========================================================= */

passwordInput?.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            emailLoginBtn?.click();

        }

    }
);


/* =========================================================
   INITIAL STATE
========================================================= */

console.log(
    "LeoDiary initialized successfully."
);
