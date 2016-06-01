/**
 * Creates an object of type Biom for showing the projects data using data tables
 * @constructor
 * @param {Object} biomObject - JSON object containing the biom file of a project 
 * @throws Will throw an error if the biomObject does not contain a id
 * @example 
 * // initializes a Biom object 
 * var biom = new Biom(biom)
 */
Biom = function(biomObject){
    if (biomObject.id === undefined){
        throw 'There is no id';
    } else {
        this.id = biomObject.id;
    }
    if (biomObject.format === undefined){
        throw 'There is no name and version of current biom format';
    } else {
        this.format = biomObject.format;
    }
    if (biomObject.format_url === undefined){
        throw 'There is no URL providing format details';
    } else {
        this.format_url = biomObject.format_url;
    }
    if (biomObject.type === undefined){
        throw 'There is no table type';
    } else {
        this.type = biomObject.type;
    }
    if (biomObject.generated_by === undefined){
        throw 'There is no package and revision  that built the table';
    } else {
        this.generated_by = biomObject.generated_by;
    }
    if (biomObject.date === undefined){
        throw 'There is no date the table was built';
    } else {
        this.date = biomObject.date;
    }
    if (biomObject.rows === undefined){
        throw 'There are no rows describing the object';
    } else {
        this.rows = biomObject.rows;
    }
    if (biomObject.columns === undefined){
        throw 'There are no columns describing the object';
    } else {
        this.columns = biomObject.columns;
    }
    if (biomObject.matrix_type === undefined){
        throw 'There is no type of matrix data representation';
    } else {
        this.matrix_type = biomObject.matrix_type;
    }
    if (biomObject.matrix_element_type === undefined){
        throw 'There is no value type in matrix';
    } else {
        this.matrix_element_type = biomObject.matrix_element_type;
    }
    if (biomObject.shape === undefined){
        throw 'There is no shape information';
    } else {
        this.shape = biomObject.shape;
    }
    if (biomObject.data === undefined){
        throw 'There is no data';
    } else {
        this.data = biomObject.data;
    }
};

/**
 * Method of Biom that creates the otu table data of biom object
 * @returns {object} otuTableData Object that contains the data for showing the otu table
 */
Biom.prototype.getOtuTable = function(otulimit){
    var that = this;
    var otuTableData = {};
    otuTableData.columns = [
        {
            data: 'OTU',
            title: 'OTU'
        }
    ];
    $.each(this.columns, function(key, value){
        otuTableData.columns.push({
            data: value.id.replace(/\./g, "\\."),
            title: value.id,
            type: 'num'
        });
    });
    otuTableData.data = [];
    //all otus up to otulimit are runned through
    var otus = 0;
    $.each(this.rows, function(rowKey, rowValue){
        thisEntry = {"OTU": rowValue.id};
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