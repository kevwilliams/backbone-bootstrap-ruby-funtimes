$(function(){ //- start after page loads

  //The model that will be used for every item inside the collection
  //(Backbone will map every item into this model)
  var ProductItemModel = Backbone.Model.extend({
    defaults : {
      name   : '',
      brandName   : '',
      image   : '',
      price   : ''
    }
  });

  var ProductItemView = Backbone.View.extend({
    tagName   : 'tr',
    template   : null,
    events     : {
    },
    
    initialize : function(){
      _.bindAll(this, 'render');
      this.template = _.template('<td><img src="<%= image %>" height="50"/><strong><%= brandName %></strong><br/><%= name %></td><td><%= price %></td>');
    },
    render : function(){
      $(this.el).html( this.template( this.model.toJSON() ) );
      return this;
    }
  });

  //- Assign the data source and which objects to create
  var ProductCollection = Backbone.Collection.extend({
    model: ProductItemModel,
    url: 'srv/response.php'
  });

  //- Get the data and create the items
  var ProductsView = Backbone.View.extend({
    id         : "real-world-id",
    //because it is a list we define the tag as ul 
    tagName     : "table", 
    className     : "real-world table table-condensed table-hover", 

    events : {
    },
    
    initialize : function(){
      _.bindAll(this, 'load', 'addItemHandler','loadCompleteHandler','errorHandler','render');
      this.collection.bind('add', this.addItemHandler);
    },

    load : function(){
      //- instead of $.ajax use Backone sync, wow! This is nice. Assigning the oncomplete and error handlers to bound methods
      this.collection.fetch({
        add: true,
        success: this.loadCompleteHandler,
        error: this.errorHandler
      });

    },  

    //- Factory method, spew out some models for each json object
    addItemHandler : function(model){
      //model is an instance of ProductItemModel
      var itemView = new ProductItemView({model:model});
      itemView.render();
      $(this.el).append(itemView.el);
    },

    loadCompleteHandler : function(){
      console.log('No errors Captain! Arrrr!');
      this.render();
    },

    errorHandler : function(){
      throw "Error loading JSON file";
    },

    render : function(){
      $('#response').append($(this.el));
      return this;
    }
  });

  var myCollection = new ProductCollection();

  // pass the collection to our testing View (I was missing this for ages!)
  var productsList = new ProductsView({collection: myCollection});
  productsList.load(); //- load the list.
});