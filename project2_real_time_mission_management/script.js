document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const errorMessage = document.getElementById('errorMessage');

    taskForm.addEventListener('submit', event => {
        event.preventDefault();
        
        try {
            // form verilerini alma
            const title = document.getElementById('title').value.trim();
            const description = document.getElementById('description').value.trim();
            const priority = document.querySelector('input[name="priority"]:checked');

            // form doğrulama
            if (!title) {
                throw new Error('Başlık alanı boş olamaz!');
            }
            
            if (!priority) {
                throw new Error('Lütfen bir öncelik seviyesi seçin!');
            }

            // yeni görev oluştur
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            
            taskItem.innerHTML = `
                <div class="task-content">
                    <h3>${title}</h3>
                    ${description ? `<p>${description}</p>` : ''}
                    <small>Öncelik: ${priority.value}</small>
                </div>
                <div class="task-actions">
                    <button class="complete-btn">Tamamla</button>
                    <button class="delete-btn">Sil</button>
                </div>
            `;

            // görevi listeye ekle
            taskList.appendChild(taskItem);
            
            // formu temizle
            taskForm.reset();
            errorMessage.style.display = 'none';

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        }
    });

    // event delegation kullanarak görev işlemleri
    taskList.addEventListener('click', event => {
        event.stopPropagation();
        
        const taskItem = event.target.closest('.task-item');
        
        if (event.target.classList.contains('complete-btn')) {
            taskItem.classList.toggle('completed');
        }
        
        if (event.target.classList.contains('delete-btn')) {
            taskItem.remove();
        }
    });
}); 