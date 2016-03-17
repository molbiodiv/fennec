function generateGeographicMap(data) {
    var map = '';
    var values = {};
    
    $.each(data['value']['labels'], function(key, value) {
        var distribution = value.split(" - ");
        var country = distribution[1];
        if($.inArray(country, _.allKeys(values)) > -1){
            values[country] = values[country] + data['value']['frequency'][key];
        } else {
            values[country] = data['value']['frequency'][key];
        }
    });
    
    map += '"labels","frequency"\r\n';
    $.each(values, function(key, value){
        map += '"' +key+ '","' +value+ '"\r\n';
    });
    
    var csvMap = new Blob([map], {type: "text/plain;charset=utf-8"});
    saveAs(csvMap, "geographicDistribution.csv");
    
    return true;
}


