function drawHistogram(){
    var cvterm_id = $("#cvterm_id").val();
    $.ajax({
        url: WebRoot.concat("/ajax/details/Traits"),
        data: {type_cvterm_id: cvterm_id},
        dataType: "json",
        success: function (data) {
            if(data['value_type'] === 'value'){
                var data = data['value'];
                $.each(data, function(key, value){
                    var plot_data = [{
                            x: value,
                            type: 'histogram'
                        }];
                    Plotly.newPlot('histogram', plot_data);
                });
            }
        }
    });
}



