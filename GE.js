// التأكد من أن الصفحة حملت بالكامل
window.onload = function() {

    const modal = document.getElementById('bookModal');
    const closeBtn = document.querySelector('.close-btn');
    const bookCards = document.querySelectorAll('.book-card');
    // كود تشغيل الفلتر
const filterButtons = document.querySelectorAll('.tag');
const allBooks = document.querySelectorAll('.book-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 1. تغيير شكل الزرار النشط
        document.querySelector('.tag.active').classList.remove('active');
        button.classList.add('active');

        // 2. الحصول على قيمة الفلتر
        const filterValue = button.getAttribute('data-filter');

        // 3. فلترة الكتب
        allBooks.forEach(book => {
            if (filterValue === 'all') {
                book.style.display = 'block'; // اظهر الكل
            } else if (book.getAttribute('data-category') === filterValue) {
                book.style.display = 'block'; // اظهر المتطابق
            } else {
                book.style.display = 'none'; // اخفي الباقي
            }
        });
    });
});
    if (!modal) {
        console.error("خطأ: لم يتم العثور على عنصر modal في الـ HTML");
        return;
    }

    bookCards.forEach(card => {
        // برمجة زر التحميل عشان ميعملش تداخل
        const downloadBtn = card.querySelector('.download-link-btn');
        if (downloadBtn) {
            downloadBtn.onclick = function(e) {
                e.stopPropagation(); // يمنع فتح المودال عند الضغط على التحميل
            };
        }

        // عند الضغط على الكارت
        card.onclick = function() {
            console.log("تم الضغط على الكارت");

            // سحب البيانات
            const title = card.querySelector('.book-title')?.innerText || "";
            const author = card.querySelector('.author')?.innerText || "";
            const description = card.querySelector('.book-description')?.innerText || "لا يوجد وصف";
            const link = downloadBtn ? downloadBtn.getAttribute('href') : "#";
            const bookImgSrc = card.querySelector('.cover-img').getAttribute('src');
            

            // وضع البيانات في المودال
            document.getElementById('modalTitle').innerText = title;
            document.getElementById('modalAuthor').innerText = author;
            document.getElementById('modalDescription').innerText = description;
            document.getElementById('modalImg').setAttribute('src', bookImgSrc);
            
            const modalLink = document.getElementById('modalDownloadLink');
            if (modalLink) {
                modalLink.setAttribute('href', link);
                modalLink.setAttribute('target', '_blank');
            }

            // إظهار المودال
            modal.style.display = "flex";
        };
    });

    // إغلاق المودال عند الضغط على X
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
        };
    }

    // إغلاق المودال عند الضغط في أي مكان خارج المحتوى
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
};