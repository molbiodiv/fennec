/**
 * Method that creates the otu table data of a biom object
 * @returns {object} otuTableData Object that contains the data for showing the otu table
 */
function getOtuTable(biom, otulimit){
    var that = biom;
    var otuTableData = {};
    otuTableData.columns = [
        {
            data: 'OTU',
            title: 'OTU'
        }
    ];
    $.each(biom.columns, function(key, value){
        otuTableData.columns.push({
            data: value.id.replace(/\./g, "\\."),
            title: value.id,
            type: 'num'
        });
    });
    otuTableData.data = [];
    //all otus up to otulimit are runned through
    var otus = 0;
    $.each(biom.rows, function(rowKey, rowValue){
        let thisEntry = {"OTU": rowValue.id};
        var data = _.filter(that.data, function(dataEntry){
            return dataEntry[0] === rowKey;
        });
        //all samples are runned through
        $.each(that.columns, function(columnKey, columnValue){
            var columnId = columnValue.id;
            if(data.length > 0){
                _.find(data, function(currentValue){
                    if(currentValue[1] === columnKey){
                        thisEntry[columnId] = currentValue[2];
                    } else {
                        thisEntry[columnId] = 0;
                    }
                });
            } else {
                thisEntry[columnId] = 0;
            }
        });
        otuTableData.data.push(thisEntry);
        otus++;
        if(otulimit && otus >= otulimit){
            // break
            return false;
        }
    });
    return otuTableData;
};