  Template.setList.helpers({
    gameSets: function() {
      return Sets.find();
    }
  });
  
  Template.results.created = function() {
  // Create local collection to store randomized result
  Workout = new Mongo.Collection(null);
};

Template.randomize.events({
  'click #doRandomize': function(event, template) {
    var numPlayers = $("#numPlayers").val();

    // Get all sets that are checked
    var sets = [];
    $("input:checkbox").each(function() {
      var $this = $(this);
      if ($this.is(":checked")) {
        sets.push($this.attr("id"));
      }
    });
    
    // Now that we have all the sets, lets get all of the cards
    var cards = [];
    _.each(sets, function(element, index, list) {
    $.merge(cards, Sets.findOne({_id: element}).cards);
    });
    
    
    console.log(cards);
  }
});