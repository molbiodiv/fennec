'use strict';

function condenseCategoricalTraitValues(organismsByValue) {
    var valueByOrganism = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.keys(organismsByValue).sort()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            var value = organismsByValue[key];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = value[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var organism = _step2.value;

                    if (organism in valueByOrganism) {
                        valueByOrganism[organism] += '/' + key;
                    } else {
                        valueByOrganism[organism] = key;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return valueByOrganism;
}

function condenseNumericalTraitValues(multipleValuesPerOrganism) {
    var singleValue = {};
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = Object.keys(multipleValuesPerOrganism)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var key = _step3.value;

            if (multipleValuesPerOrganism[key].length > 0) {
                singleValue[key] = multipleValuesPerOrganism[key].reduce(function (acc, val) {
                    return Number(acc) + Number(val);
                }) / multipleValuesPerOrganism[key].length;
            }
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    return singleValue;
}
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