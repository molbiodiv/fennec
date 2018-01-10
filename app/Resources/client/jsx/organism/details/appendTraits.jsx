/**
 * Created by s216121 on 14.03.17.
 */

function appendTraitEntries(domElement, traitEntries, traitFormat){
    $.ajax({
        url: Routing.generate('api_details_trait_entries', {'dbversion': dbversion}),
        data: {
            "trait_entry_ids": traitEntries,
            "trait_format": traitFormat
        },
        method: "GET",
        success: function(result){
            $.each(result, function (key, value) {
                var realValue = value.value;
                if(value.value === null){
                    realValue = value.value_definition;
                }
                let unitString = ""
                if(value.unit != null){
                    unitString = " $"+ value.unit +"$"
                }
                let traitCitationDiv = $('<div class="trait-citation">').text(value.citation).css({'font-size': '11px'})
                let originUrl = $(`<a href="${value.origin_url}">`).text(" origin")
                if(value.origin_url != ""){
                    traitCitationDiv.append(originUrl)
                }
                domElement.append($('<div>').text(realValue+unitString).append(traitCitationDiv));
            });
        }
    });
}

// export function globally
global.appendTraitEntries = appendTraitEntries;