// --- Elements ---
const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesContainer = document.getElementById('notesContainer');
const errorMessage = document.getElementById('errorMessage');
const quoteText = document.getElementById('quoteText');

// --- State Management ---
let notes = JSON.parse(localStorage.getItem('myNotes')) || [];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderNotes();
    fetchInspiration(); // API Integration
});

// --- API Integration ---
async function fetchInspiration() {
    try {
        const response = await fetch('https://api.quotable.io/random?tags=wisdom');
        if (response.ok) {
            const data = await response.json();
            quoteText.innerText = `"${data.content}" — ${data.author}`;
        }
    } catch (error) {
        quoteText.innerText = "Focus on your goals and keep writing notes!";
        console.log("API Error:", error);
    }
}

// --- CRUD Operations ---

// CREATE
addNoteBtn.addEventListener('click', () => {
    const text = noteInput.value.trim();

    if (text === "") {
        errorMessage.classList.remove('hidden');
        noteInput.classList.add('border-red-500', 'shake'); // Uses custom CSS shake
        setTimeout(() => noteInput.classList.remove('shake'), 500);
        return;
    }

    errorMessage.classList.add('hidden');
    noteInput.classList.remove('border-red-500');

    const newNote = {
        id: Date.now(),
        content: text,
        date: new Date().toLocaleDateString()
    };

    notes.push(newNote);
    saveAndRender();
    noteInput.value = "";
});

// DELETE
function deleteNote(id) {
    if (confirm("Are you sure you want to delete this note?")) {
        notes = notes.filter(note => note.id !== id);
        saveAndRender();
    }
}

// EDIT (Update)
function editNote(id) {
    const noteToEdit = notes.find(note => note.id === id);
    const newContent = prompt("Update your note:", noteToEdit.content);
    
    if (newContent !== null && newContent.trim() !== "") {
        noteToEdit.content = newContent.trim();
        saveAndRender();
    }
}

// --- UI Logic ---

function saveAndRender() {
    localStorage.setItem('myNotes', JSON.stringify(notes));
    renderNotes();
}

function renderNotes() {
    notesContainer.innerHTML = "";

    if (notes.length === 0) {
        notesContainer.innerHTML = `<p class="col-span-full text-center text-gray-400 mt-4">No notes found. Start adding some!</p>`;
        return;
    }

    notes.forEach(note => {
        const noteCard = document.createElement('div');
        // note-card class triggers the CSS animation
        noteCard.className = "note-card bg-white p-5 rounded-lg shadow border-l-4 border-blue-500 flex flex-col justify-between";
        
        noteCard.innerHTML = `
            <div>
                <span class="text-[10px] text-gray-400 uppercase font-bold">${note.date}</span>
                <p class="text-gray-700 mt-2 whitespace-pre-wrap">${note.content}</p>
            </div>
            <div class="flex justify-end gap-2 mt-4">
                <button onclick="editNote(${note.id})" class="text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1 rounded transition">Edit</button>
                <button onclick="deleteNote(${note.id})" class="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded transition">Delete</button>
            </div>
        `;
        notesContainer.appendChild(noteCard);
    });
}