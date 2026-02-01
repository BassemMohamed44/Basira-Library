// 1. رابط جوجل شيت ورابط ملف الـ JSON
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQgX6tnJvi6XB2sTsURm-qqnCSn2HMLLekqWq3vO2-edyNYXyk_WjpS3-mBWP0tJDQ39Ni-i_V4xrVU/pub?output=csv'; 
const LOCAL_JSON_URL = 'books.json';

let allBooks = [];

document.addEventListener('DOMContentLoaded', () => {
    const booksGrid = document.getElementById('booksGrid');
    const modal = document.getElementById('bookModal');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.tag');

    // دالة جلب البيانات مع نظام الخطة البديلة (Fallback)
    function loadData() {
        console.log("محاولة جلب البيانات من Google Sheets...");
        
        Papa.parse(SHEET_URL, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                // نجاح التحميل من جوجل
                allBooks = results.data;
                console.log("تم تحميل البيانات من Google Sheets بنجاح.");
                displayBooks(allBooks);
            },
            error: function(err) {
                // فشل التحميل من جوجل -> ننتقل للخطة البديلة
                console.warn("فشل جوجل شيت، جاري الانتقال لملف JSON المحلي...");
                loadLocalFallback();
            }
        });
    }

    // دالة الخطة البديلة - تحميل JSON محلي
    function loadLocalFallback() {
        fetch(LOCAL_JSON_URL)
            .then(response => {
                if (!response.ok) throw new Error();
                return response.json();
            })
            .then(data => {
                allBooks = data;
                console.log("تم تحميل البيانات من ملف JSON بنجاح (خطة بديلة).");
                displayBooks(allBooks);
            })
            .catch(error => {
                console.error("كل المحاولات فشلت. تأكد من وجود ملف JSON أو اتصال الإنترنت.");
            });
    }

    // دالة العرض (Display) - محدثة وشاملة
    function displayBooks(booksToShow) {
        if (!booksGrid) return;
        booksGrid.innerHTML = ""; 
        
        booksToShow.forEach((book, index) => {
            if(!book.title) return; 

            const bookCard = `
                <div class="book-card" onclick="openModal(${index})">
                    <div class="card-header">
                        <span class="category-badge">${book.categoryName || 'عام'}</span>
                        <div class="book-placeholder">
                            <img src="${book.image}" alt="${book.title}" class="cover-img">
                        </div>
                    </div>
                    <div class="card-body">
                        <h3 class="book-title">${book.title}</h3>
                        <div class="book-info">
                            <p class="author"><i class="fa-solid fa-user"></i> ${book.author}</p>
                            <p class="year"><i class="fa-solid fa-calendar-days"></i> ${book.year || '----'}</p>
                        </div>
                        <a class="download-btn" target="_blank" href="${book.downloadUrl}" onclick="event.stopPropagation()">تحميل الكتاب</a>
                    </div>
                </div>
            `;
            booksGrid.innerHTML += bookCard;
        });
        
        // تحديث العداد
        const statsBar = document.querySelector('.stats-bar span');
        if (statsBar) statsBar.innerText = `${booksToShow.length} كتاب`;
    }

    // دالة المودال
    window.openModal = function(index) {
        const book = allBooks[index];
        if (!book) return;
        document.getElementById('modalTitle').innerText = book.title;
        document.getElementById('modalAuthor').innerText = book.author;
        document.getElementById('modalDescription').innerText = book.description || 'لا يوجد وصف';
        document.getElementById('modalImg').src = book.image;
        modal.style.display = "flex";
    };

    // نظام البحث والفلترة (كما هي في الأكواد السابقة)
    searchInput?.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase().trim();
        const filtered = allBooks.filter(b => b.title?.toLowerCase().includes(term) || b.author?.toLowerCase().includes(term));
        displayBooks(filtered);
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.tag.active')?.classList.remove('active');
            btn.classList.add('active');
            const val = btn.getAttribute('data-filter');
            displayBooks(val === 'all' ? allBooks : allBooks.filter(b => b.category === val));
        });
    });

    // إغلاق المودال
    document.querySelector('.close-btn').onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if(e.target == modal) modal.style.display = "none"; };

    loadData(); // ابدأ المحاولة الأولى
});