// Do your work here...
// Memastikan Bahwa JavaScript hanya akan berjalan setelah seluruh konten HTML telah dimuat sepenuhnya.
document.addEventListener("DOMContentLoaded", function () {
  // Mengambil elemen HTML berdasarkan id
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  
  const STORAGE_KEY = "BOOKSHELF_APP"; // STORAGE_KEY digunakan sebagai kunci untuk menyimpan data di localStorage
  // Mengambil data dari localStorage, lalu mengonversinya dari format JSON ke objek JavaScript, jika localStorage kosong maka variabel book akan menjadi array kosong[]
  let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  
  // Mengonversi array books menjadi string JSON lalu menyimpannya ke localStorage
  function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
  
  // Membuat ID buku unik menggunakan timestamp Date().getTime()
  function generateBookId() {
    return new Date().getTime();
  }
  
  // Membuat Elemen HTML yang baru dengan Bootstrap styling
  function createBookElement(book) {
    // div untuk menampilkan buku dengan Bootstrap classes
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");
    bookElement.className = "book-item p-3 mb-3";
    
    // h3 menampilkan judul buku (sesuai template yang diminta)
    const title = document.createElement("h3");
    title.textContent = book.title;
    title.setAttribute("data-testid", "bookItemTitle");
    title.className = "mb-2";
    
    // p untuk menampilkan penulis dan tahun dengan Bootstrap styling
    const author = document.createElement("p");
    author.textContent = `Penulis: ${book.author}`;
    author.setAttribute("data-testid", "bookItemAuthor");
    author.className = "mb-1";
    
    const year = document.createElement("p");
    year.textContent = `Tahun: ${book.year}`;
    year.setAttribute("data-testid", "bookItemYear");
    year.className = "mb-3";
    
    // Membuat elemen div baru sebagai wadah untuk tombol button dengan Bootstrap classes
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "book-actions d-flex gap-2";
    
    // Mengubah status buku menjadi selesai dibaca atau belum selesai dibaca
    const toggleButton = document.createElement("button");
    toggleButton.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
    toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    toggleButton.className = "btn btn-success btn-sm flex-fill";
    
    // Menambahkan icon ke toggle button
    const toggleIcon = document.createElement("i");
    toggleIcon.className = "bi bi-check-circle me-1";
    toggleButton.prepend(toggleIcon);
    
    toggleButton.addEventListener("click", function () {
      book.isComplete = !book.isComplete;
      saveToLocalStorage(); // setelah perubahan, data disimpan kembali ke localStorage
      renderBooks(); // halaman diperbarui dengan renderBooks()
    });
    
    // Tombol edit buku (sesuai ketentuan tugas)
    const editButton = document.createElement("button");
    editButton.textContent = "Edit Buku";
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.className = "btn btn-warning btn-sm flex-fill";
    
    // Menambahkan icon ke edit button
    const editIcon = document.createElement("i");
    editIcon.className = "bi bi-pencil-square me-1";
    editButton.prepend(editIcon);
    
    editButton.addEventListener("click", function () {
      editBook(book);
    });
    
    // Menghapus buku dari array books menggunakan filter()
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Hapus Buku";
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.className = "btn btn-danger btn-sm flex-fill";
    
    // Menambahkan icon ke delete button
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "bi bi-trash me-1";
    deleteButton.prepend(deleteIcon);
    
    deleteButton.addEventListener("click", function () {
      // Tambahkan konfirmasi sebelum menghapus
      if (confirm(`Apakah Anda yakin ingin menghapus buku "${book.title}"?`)) {
        books = books.filter(b => b.id !== book.id);
        saveToLocalStorage(); // setelah itu, data disimpan kembali ke localStorage
        renderBooks(); // tampilan diperbarui dengan renderBooks()
      }
    });
    
    // Menambahkan tombol ke dalam buttonContainer (sesuai urutan template)
    buttonContainer.append(toggleButton, deleteButton, editButton);
    // Setelah tombol dimasukkan ke dalam buttonContainer, elemen ini akan dimasukkan ke dalam elemen utama buku
    bookElement.append(title, author, year, buttonContainer);
    
    return bookElement;
  }
  
  // Membuat empty state untuk daftar kosong
  function createEmptyState(type) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "empty-state";
    
    const icon = document.createElement("i");
    icon.className = type === "complete" ? "bi bi-check-circle" : "bi bi-book";
    
    const text = document.createElement("p");
    text.className = "mb-0";
    text.textContent = type === "complete" ? 
      "Belum ada buku yang selesai dibaca" : 
      "Belum ada buku yang belum selesai dibaca";
    
    emptyDiv.append(icon, text);
    return emptyDiv;
  }
  
  // Mengosongkan daftar buku sebelum diperbarui
  function renderBooks() {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";
    
    // Pisahkan buku berdasarkan status
    const incompleteBooks = books.filter(book => !book.isComplete);
    const completeBooks = books.filter(book => book.isComplete);
    
    // Render buku yang belum selesai dibaca
    if (incompleteBooks.length === 0) {
      incompleteBookList.appendChild(createEmptyState("incomplete"));
    } else {
      incompleteBooks.forEach(book => {
        const bookElement = createBookElement(book);
        incompleteBookList.appendChild(bookElement);
      });
    }
    
    // Render buku yang sudah selesai dibaca
    if (completeBooks.length === 0) {
      completeBookList.appendChild(createEmptyState("complete"));
    } else {
      completeBooks.forEach(book => {
        const bookElement = createBookElement(book);
        completeBookList.appendChild(bookElement);
      });
    }
  }
  
  // Update submit button text berdasarkan checkbox
  function updateSubmitButtonText() {
    const isComplete = document.getElementById("bookFormIsComplete").checked;
    const submitButtonText = document.getElementById("submitButtonText");
    if (submitButtonText) {
      submitButtonText.textContent = isComplete ? "Selesai dibaca" : "Belum selesai dibaca";
    }
  }
  
  // Event listener untuk checkbox
  document.getElementById("bookFormIsComplete").addEventListener("change", updateSubmitButtonText);
  
  // Menambahkan buku baru
  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Mengambil input pengguna dari form title, author, year, isComplete
    const title = document.getElementById("bookFormTitle").value.trim();
    const author = document.getElementById("bookFormAuthor").value.trim();
    const year = parseInt(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;
    
    // Validasi input
    if (!title || !author || !year) {
      alert("Mohon lengkapi semua field yang diperlukan!");
      return;
    }
    
    if (year < 1000 || year > new Date().getFullYear()) {
      alert("Tahun tidak valid!");
      return;
    }
    
    // Membuat objek newBook
    const newBook = {
      id: generateBookId(),
      title,
      author,
      year,
      isComplete
    };
    
    books.push(newBook); // lalu menambahkannya ke array books
    saveToLocalStorage(); // menyimpan ke localStorage
    renderBooks(); // memperbarui tampilan dengan renderBooks()
    bookForm.reset(); // menggunakan bookForm.reset() agar form kembali kosong setelah pengisian
    
    // Reset submit button text
    updateSubmitButtonText();
    
    // Tampilkan notifikasi sukses
    showNotification(`Buku "${title}" berhasil ditambahkan!`, "success");
  });
  
  // Mengambil kata kunci pencarian dari input pengguna
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchText = document.getElementById("searchBookTitle").value.toLowerCase().trim();
    
    // Jika search text kosong, tampilkan semua buku
    if (!searchText) {
      renderBooks();
      return;
    }
    
    // mengosongkan daftar buku sebelum menampilkan hasil pencarian
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";
    
    // melakukan pencarian dengan filter()
    const searchResults = books.filter(book => 
      book.title.toLowerCase().includes(searchText) || 
      book.author.toLowerCase().includes(searchText)
    );
    
    if (searchResults.length === 0) {
      // Tampilkan pesan jika tidak ada hasil pencarian
      const noResultDiv = document.createElement("div");
      noResultDiv.className = "empty-state";
      noResultDiv.innerHTML = `
        <i class="bi bi-search"></i>
        <p class="mb-0">Tidak ada buku yang ditemukan untuk "${searchText}"</p>
      `;
      incompleteBookList.appendChild(noResultDiv);
    } else {
      searchResults.forEach(book => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
          completeBookList.appendChild(bookElement);
        } else {
          incompleteBookList.appendChild(bookElement);
        }
      });
    }
  });
  
  // Fungsi untuk mengedit buku
  function editBook(book) {
    // Buat modal untuk edit buku
    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.setAttribute("tabindex", "-1");
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Buku</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="editBookForm">
              <div class="mb-3">
                <label for="editTitle" class="form-label fw-bold">Judul</label>
                <input type="text" class="form-control" id="editTitle" value="${book.title}" required>
              </div>
              <div class="mb-3">
                <label for="editAuthor" class="form-label fw-bold">Penulis</label>
                <input type="text" class="form-control" id="editAuthor" value="${book.author}" required>
              </div>
              <div class="mb-3">
                <label for="editYear" class="form-label fw-bold">Tahun</label>
                <input type="number" class="form-control" id="editYear" value="${book.year}" min="1000" max="${new Date().getFullYear()}" required>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="editIsComplete" ${book.isComplete ? 'checked' : ''}>
                  <label class="form-check-label fw-bold" for="editIsComplete">
                    Selesai dibaca
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
            <button type="button" class="btn btn-primary-custom" id="saveEditBtn">Simpan Perubahan</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Inisialisasi Bootstrap modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    // Event listener untuk tombol simpan
    document.getElementById("saveEditBtn").addEventListener("click", function() {
      const editedTitle = document.getElementById("editTitle").value.trim();
      const editedAuthor = document.getElementById("editAuthor").value.trim();
      const editedYear = parseInt(document.getElementById("editYear").value);
      const editedIsComplete = document.getElementById("editIsComplete").checked;
      
      // Validasi input
      if (!editedTitle || !editedAuthor || !editedYear) {
        alert("Mohon lengkapi semua field!");
        return;
      }
      
      if (editedYear < 1000 || editedYear > new Date().getFullYear()) {
        alert("Tahun tidak valid!");
        return;
      }
      
      // Update buku
      const bookIndex = books.findIndex(b => b.id === book.id);
      if (bookIndex !== -1) {
        books[bookIndex] = {
          ...books[bookIndex],
          title: editedTitle,
          author: editedAuthor,
          year: editedYear,
          isComplete: editedIsComplete
        };
        
        saveToLocalStorage();
        renderBooks();
        bootstrapModal.hide();
        showNotification(`Buku "${editedTitle}" berhasil diperbarui!`, "success");
      }
    });
    
    // Hapus modal dari DOM setelah ditutup
    modal.addEventListener("hidden.bs.modal", function() {
      document.body.removeChild(modal);
    });
  }
  
  // Fungsi untuk menampilkan notifikasi
  function showNotification(message, type = "info") {
    // Buat elemen alert Bootstrap
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = "top: 20px; right: 20px; z-index: 1050; max-width: 300px;";
    
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Hapus notifikasi setelah 3 detik
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.parentNode.removeChild(alertDiv);
      }
    }, 3000);
  }
  
  // Reset pencarian saat input kosong
  document.getElementById("searchBookTitle").addEventListener("input", function(event) {
    if (event.target.value.trim() === "") {
      renderBooks();
    }
  });
  
  // Inisialisasi Aplikasi: dipanggil di akhir kode agar daftar buku langsung ditampilkan saat halaman pertama kali dimuat
  renderBooks();
  
  // Set initial submit button text
  updateSubmitButtonText();
});