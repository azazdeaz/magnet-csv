// modified from http://html5demos.com/file-api
var holder = document.body,
    state = document.getElementById('status');

if (typeof window.FileReader === 'undefined') {
    state.className = 'fail';
} else {
    state.className = 'success';
    state.innerHTML = 'Dobd ide az XML fájlt!';
}

holder.ondragover = function() {
    this.className = 'hover';
    return false;
};

holder.ondragleave = function() {
    this.className = '';
    return false;
};
holder.ondragend = function() {
    this.className = '';
    return false;
};
holder.ondrop = function(e) {
    this.className = '';
    e.preventDefault();

    var file = e.dataTransfer.files[0],
        reader = new FileReader();
    reader.onload = function(event) {
        var x2js = new X2JS();
        var json = x2js.xml_str2json(event.target.result);
        var transactions = json.NetBankXML.Tranzakcio
        var csv = transactions
          .map(function (transaction) {
            return [
              Date.parse(transaction.Esedekessegnap.slice(0, -1)).toString('yyyy/MM/dd'),
              transaction.Osszeg.__text,
              transaction.Ellenpartner,
            ]
            .map(function (text) {return '"' + text + '"'})
            .join(',')
          })
          .join('\n')
        console.log(transactions);
        var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
        saveAs(blob, 'kivonat'+new Date().toString('yyyy/MM/dd')+'.csv');
    };
    console.log(file);
    reader.readAsText(file);

    return false;
};
