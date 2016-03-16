function generateGeographicMap(data) {
    var csvMap;
    var map = [];
    var line = {};
    
    $.each(data['value']['labels'], function(key, value) {
        var distribution = value.split(" - ");
        var country = distribution[1];
        line = {
            "label": country,
            "frequency": data['value']['frequency'][key]
        }
        map.push(line);
    });
    csvMap = JSON2CSV(map);
    return csvMap;
}

function JSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

    var str = '';
    var line = '';
    for (var index in array[0]) {
        line += index + ',';
    }

    line = line.slice(0, -1);
    str += line + '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';

        for (var index in array[i]) {
            line += array[i][index] + ',';
        }
				
        line = line.slice(0, -1);
        str += line + '\r\n';
    }
    return str;
}


