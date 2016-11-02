'use strict';

/**
 * Method that creates the otu table data of a biom object
 * @returns {object} otuTableData Object that contains the data for showing the otu table
 */
function getOtuTable(biom, otulimit) {
    var that = biom;
    var otuTableData = {};
    otuTableData.columns = [{
        data: 'OTU',
        title: 'OTU'
    }];
    $.each(biom.columns, function (key, value) {
        otuTableData.columns.push({
            data: value.id.replace(/\./g, "\\."),
            title: value.id,
            type: 'num'
        });
    });
    otuTableData.data = [];
    //all otus up to otulimit are runned through
    var otus = 0;
    $.each(biom.rows, function (rowKey, rowValue) {
        var thisEntry = { "OTU": rowValue.id };
        var data = _.filter(that.data, function (dataEntry) {
            return dataEntry[0] === rowKey;
        });
        //all samples are runned through
        $.each(that.columns, function (columnKey, columnValue) {
            var columnId = columnValue.id;
            if (data.length > 0) {
                _.find(data, function (currentValue) {
                    if (currentValue[1] === columnKey) {
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
        if (otulimit && otus >= otulimit) {
            // break
            return false;
        }
    });
    return otuTableData;
};
"use strict";

/**
 * Selects the best vernacularName from the object returned by the eol pages API.
 * It only considers english names (language: en) and preferes those with eol_preferred: true.
 * The scientificName is used as fallback.
 * @param eolObject {Object} object returned by the eol pages API
 * @returns {String} bestName
 */
function getBestVernacularNameEOL(eolObject) {
    var bestName = "";
    if (typeof eolObject.scientificName !== "undefined") {
        bestName = eolObject.scientificName;
    }
    if (typeof eolObject.vernacularNames !== "undefined" && eolObject.vernacularNames.length > 0) {
        var preferred = false;
        eolObject.vernacularNames.forEach(function (value) {
            if (value.language === "en") {
                if (typeof value.eol_preferred !== "undefined" && value.eol_preferred) {
                    preferred = true;
                    bestName = value.vernacularName;
                } else if (!preferred) {
                    bestName = value.vernacularName;
                }
            }
        });
    }
    return bestName;
};