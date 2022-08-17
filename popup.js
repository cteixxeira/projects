define([
    'underscore',
    'backbone',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc/simplexml/element/table',
    ], function(_, Backbone, $, mvc, SearchManager, TableElement) {

        var modalTemplate = "<div id=\"pivotModal\" class=\"modal\">" +
                       "<div class=\"modal-header\"><h3><%- title %></h3><button class=\"close\">Close</button></div>" +
                       "<div class=\"modal-body\"></div>" +
                       "<div class=\"modal-footer\"><button type=\"button\" id=\"teste\" class=\"confirm\">Confirmar</button></div>" +
                       "</div>" +
                       "<div class=\"modal-backdrop\"></div>";

        var ModalView = Backbone.View.extend({

            defaults: {
                   title: 'Not set'
            },

            initialize: function(options) {
                this.options = options;
                this.options = _.extend({}, this.defaults, this.options);
                this.childViews = [];
                console.log('Hello from the modal window: ', this.options.title);
                this.template = _.template(modalTemplate);
            },

            events: {
                   'click .close': 'close',
               'click .modal-backdrop': 'close',
               'click .confirm': 'confirm',
            },

            render: function() {
                var data = { title : this.options.title };
                    this.$el.html(this.template(data));
                return this;
            },

            show: function() {
                    $(document.body).append(this.render().el);

                $(this.el).find('.modal-body').append('<div id="modalVizualization"/>');

                $(this.el).find('.modal').css({
                    width:'90%',
                    height:'auto',
                    left: '5%',
                    'margin-left': '0',
                    'max-height':'100%'
                });

                var search = mvc.Components.get(this.options.search.id);

                var detailTable = new TableElement({
                        id: "detailTable",
                        managerid: search.name,
                        pageSize: "5",
                        el: $('#modalVizualization')
                }).render();

                this.childViews.push(detailTable);
                search.startSearch();
            },

            close: function() {
                   this.unbind();
               this.remove();
               _.each(this.childViews, function(childView) {

                   childView.unbind();
                   childView.remove();

               });
            },

            confirm: function(selected_values_array) {
                tokens.set("mytoken", selected_values_array.join());
                submittedTokens.set(tokens.toJSON());
                new SearchManager({
                    id: "envSearch",
                    earliest_time: "$time$",
                    latest_time: "$time$",
                    preview: true,
                    cache: false,
                    search: "| makeresults | eval myvalue=\"$mytoken$\" | makemv delim=\",\" myvalue | rename myvalue as URL | stats count by URL | table URL | outputlookup append=t dev-tk"
                });
            }
        });

        return ModalView;
    });