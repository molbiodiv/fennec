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
                var realValue = value.valueName;
                if(value.valueName === null){
                    realValue = value.valueDefinition;
                }
                let unitString = ""
                if(value.unit != null){
                    unitString = " $"+ value.unit +"$"
                }
                let traitCitationDiv = $('<div class="trait-citation">').text(value.citation).css({'font-size': '11px'})
                let originUrl = $(`<a href="${value.originUrl}">`).text(" origin")
                if(value.originUrl != ""){
                    traitCitationDiv.append(originUrl)
                }
                domElement.append($('<div>').text(realValue+unitString).append(traitCitationDiv));
            });
        }
    });
}

// export function globally
global.appendTraitEntries = appendTraitEntries;