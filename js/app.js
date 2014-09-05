$(function(){ //- start after page loads

  Backbone.pubSub = _.extend({}, Backbone.Events); //- This is the global event listener to fire the UpdateEvents when a product is added
                                                   //- idea was taken from: http://stackoverflow.com/questions/9984859/backbone-js-can-one-view-trigger-updates-in-other-views


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

    events : {
      'click .product' : "addToOutfit"
    },
    initialize : function(){
      _.bindAll(this, 'render','addToOutfit');
      this.template = _.template('<td class="product"><img align="left" src="<%= image %>" height="50"/><strong><%= brandName %></strong><br/><%= name %></td><td>$<%= price %></td>');
    },

    render : function(){
      $(this.el).html( this.template( this.model.toJSON() ) );
      return this;
    },

    addToOutfit : function() {
      Backbone.pubSub.trigger('addToOutfit', this);
      $(this.el).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
    }
  });

  //- Assign the data source and which objects to create
  var ProductCollection = Backbone.Collection.extend({
    model: ProductItemModel,
    url: 'srv/response.php',

  });

  //- Get the data and create the items
  var ProductsView = Backbone.View.extend({
    id         : "real-world-id",
    tagName     : "table", 
    className     : "real-world table table-condensed table-hover", 

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

  //- View to track what is in each slot and the total price.
  var CartView = Backbone.View.extend({
    price : 0.00,
    priceEl : '#totalPrice',

    initialize : function() 
    {
      _.bindAll(this, 'addGarment','render');
      Backbone.pubSub.on('addToOutfit', this.addGarment, this);
    },

    addGarment : function(g) 
    {
      this.price = parseInt(this.price) + parseInt(g.model.get('price'));
      this.render();
    },

    render : function() {
      $(this.priceEl).html(this.price);
    }

  });

  //- Get the products
  var myCollection = new ProductCollection();
  var c = new CartView();

  // pass them to to our View (I was missing this for ages!)
  var productsList = new ProductsView({collection: myCollection});
  productsList.load(); //- load the list.
});