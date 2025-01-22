function readBibleContentFromXL() {
    const filePath = chrome.runtime.getURL('kjv.xlsx');
    fetch(filePath)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const results = {};
            for (let i = 2; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (row.length >= 2) {
                    results[row[0]] = row[1];
                }
            }
            window.bibleData = results;
        })
        .catch(error => console.error('Error loading the Excel file:', error));
}

readBibleContentFromXL();

$(document).ready(function () {
    $('#searchButton').on('click', function () {
        const query = $('#searchInput').val().trim();
        const resultHeader = $('#resultHeader');
        const resultsDiv = $('#results');
        resultsDiv.empty();
        if (window.bibleData && query in window.bibleData) {
            resultHeader.show();
            resultsDiv.append(`<p><strong>${query}:</strong> ${window.bibleData[query]}</p>`);
        } else {
            resultHeader.show();
            resultsDiv.append(`<p class="text-danger">No results found for "${query}". Please try another verse. Follow this pattern 'John 3:16'</p>`);
        }
    });
});
