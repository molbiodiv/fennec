describe("The constructor is supposed a proper Biom object", function() {
    it('Constructor Biom exists', function(){
        var biomObject = {
            "id": "No Table ID",
            "format": "Biological Observation Matrix 2.1.0",
            "format_url": "http://biom-format.org",
            "matrix_type": "sparse",
            "generated_by": "BIOM-Format 2.1",
            "date": "2016-05-03T08:13:41.848780",
            "type": "OTU table",
            "matrix_element_type": "float",
            "shape": [10, 5],
            "data": [[0,0,120.0],[3,1,12.0],[5,2,20.0],[7,3,12.7],[8,4,16.0]],
            "rows": [
                {"id": "OTU_1", "metadata": {}},
                {"id": "OTU_2", "metadata": {}},
                {"id": "OTU_3", "metadata": {}},
                {"id": "OTU_4", "metadata": {}},
                {"id": "OTU_5", "metadata": {}},
                {"id": "OTU_6", "metadata": {}},
                {"id": "OTU_7", "metadata": {}},
                {"id": "OTU_8", "metadata": {}},
                {"id": "OTU_9", "metadata": {}},
                {"id": "OTU_10", "metadata": {}}
            ],
            "columns": [
                {"id": "Sample_1", "metadata": {}},
                {"id": "Sample_2", "metadata": {}},
                {"id": "Sample_3", "metadata": {}},
                {"id": "Sample_4", "metadata": {}},
                {"id": "Sample_5", "metadata": {}}
            ]
        };
        var biom = new Biom(biomObject);
        expect(biom).toBeDefined();
    });
    it('Throws error message if biom object does not contain an id', function(){
        var biomObject = {};
        expect(function(){Biom(biomObject);}).toThrow('There is no id');
        expect(function(){Biom(biomObject);}).toThrow('There is no name and version of current biom format');
        expect(function(){Biom(biomObject);}).toThrow('There is no URL providing format details');
        expect(function(){Biom(biomObject);}).toThrow('There is no table type');
        expect(function(){Biom(biomObject);}).toThrow('There is no package and revision  that built the table');
        expect(function(){Biom(biomObject);}).toThrow('There is no date the table was built');
        expect(function(){Biom(biomObject);}).toThrow('There are no rows describing the object');
        expect(function(){Biom(biomObject);}).toThrow('There are no columns describing the object');
        expect(function(){Biom(biomObject);}).toThrow('There is no type of matrix data representation');
        expect(function(){Biom(biomObject);}).toThrow('There is no value type in matrix');
        expect(function(){Biom(biomObject);}).toThrow('There is no shape information');
        expect(function(){Biom(biomObject);}).toThrow('There is no data');
    });
});

