// statik öğrenci verisi
let studentData = [
    { id: 1, isim: "Ahmet Yılmaz", sinif: "10-A" },
    { id: 2, isim: "Ayşe Demir", sinif: "11-B" },
    { id: 3, isim: "Mehmet Kaya", sinif: "9-C" }
];

// tabloyu güncelleme fonksiyonu
function tabloGuncelle() {
    const tbody = $('#ogrenciTablosu tbody');
    tbody.empty();

    studentData.forEach(ogrenci => {
        tbody.append(`
            <tr data-id="${ogrenci.id}">
                <td>${ogrenci.id}</td>
                <td>${ogrenci.isim}</td>
                <td>${ogrenci.sinif}</td>
                <td>
                    <button class="silBtn" data-id="${ogrenci.id}">Sil</button>
                </td>
            </tr>
        `);
    });
}

$(document).ready(function() {

    tabloGuncelle();
    // yeni öğrenci ekleme
    $('#ekleBtn').click(function() {
        const isim = $('#isim').val();
        const sinif = $('#sinif').val();

        if (isim && sinif) {
            const yeniOgrenci = {
                id: studentData.length > 0 ? Math.max(...studentData.map(o => o.id)) + 1 : 1,
                isim: isim,
                sinif: sinif
            };

            studentData.push(yeniOgrenci);
            tabloGuncelle();

            // input alanlarını temizleme
            $('#isim').val('');
            $('#sinif').val('');
        } else {
            alert('Lütfen tüm alanları doldurun!');
        }
    });

    // çğrenci silme
    $(document).on('click', '.silBtn', function() {
        const id = $(this).data('id');
        studentData = studentData.filter(ogrenci => ogrenci.id !== id);
        tabloGuncelle();
    });

    // satır secme
    $(document).on('click', 'tr', function() {
        $('tr').removeClass('selected');
        $(this).addClass('selected');
    });
}); 