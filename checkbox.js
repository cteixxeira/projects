require([
    'underscore',
    'jquery',
    'backbone',
    '../app/meuapp/popup',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc/simplexml/ready!'
], function (_, $, Backbone, ModalView, mvc, TableView, SearchManager) {
    // Access the "default" token model
    var tokens = mvc.Components.get("default");
    var selected_values_array = [];
    var submittedTokens = mvc.Components.get('submitted');


    var CustomRangeRenderer = TableView.BaseCellRenderer.extend({
        canRender: function (cell) {
            return _(['teste']).contains(cell.field);
        },
        render: function ($td, cell) {
            var a = $('<div>').attr({ "id": "chk-URL" + cell.value, "value": cell.value }).addClass('checkbox').click(function () {
                // console.log("checked",$(this).attr('class'));
                // console.log("checked",$(this).attr('value'));
                if ($(this).attr('class') === "checkbox") {
                    selected_values_array.push($(this).attr('value'));
                    $(this).removeClass();
                    $(this).addClass("checkbox checked");
                }
                else {
                    $(this).removeClass();
                    $(this).addClass("checkbox");
                    var i = selected_values_array.indexOf($(this).attr('value'));
                    if (i != -1) {
                        selected_values_array.splice(i, 1);
                    }
                    // Change the value of a token $mytoken$
                }
                console.log(selected_values_array);
            }).appendTo($td);
            console.log(selected_values_array);
        }
    });

    var detailSearch = new SearchManager({
        id: "detailSearch",
        earliest_time: "$time$",
        latest_time: "$time$",
        preview: true,
        cache: false,
        search: "| makeresults | eval myvalue=\"$mytoken$\" | makemv delim=\",\" myvalue | stats count by myvalue | table myvalue"
    }, { tokens: true, tokenNamespace: "submitted" });
 
    //List of table IDs
    var tableIDs = ["myTable"];
    for (i = 0; i < tableIDs.length; i++) {
        var sh = mvc.Components.get(tableIDs[i]);
        if (typeof (sh) != "undefined") {
            sh.getVisualization(function (tableView) {
                // Add custom cell renderer and force re-render
                tableView.table.addCellRenderer(new CustomRangeRenderer());
                tableView.table.render();
            });
        }
    };

    $(document).ready(function () {
        $("#mybutton").on("click", function (e) {
            e.preventDefault();
            tokens.set("mytoken", selected_values_array.join());
            submittedTokens.set(tokens.toJSON());
            var modal = new ModalView({ title: "VAI", search: detailSearch });
            modal.show();
            console.log(tokens);
            console.log(selected_values_array  + " selected_values_array");
            console.log(modal  + " modal");
            //console.log(render);
        });
    });
});