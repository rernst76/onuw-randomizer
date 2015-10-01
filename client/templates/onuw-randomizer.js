Template.setList.helpers({
    gameSets: function() {
      return Sets.find();
    }
});
  
Template.results.helpers({
  randomCards: function() {
    return roleSet.find();
  }
});
  
Template.results.created = function() {
  // Create local collection to store randomized result
  roleSet = new Mongo.Collection(null);
};

Array.prototype.randomElement = function () {
    var randIndex;
    randIndex = Math.floor(Math.random() * this.length);
    return this.splice(randIndex)[0];
};

Template.randomize.events({
  'click #doRandomize': function(event, template) {
    var numPlayers = parseInt($("#numPlayers").val(),10);
    var numWolves  = parseInt($("#numWolves").val(),10);
    numPlayers = numPlayers + 3;
    
    // Empty existing set in collection
    roleSet.remove({});

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
    _.each(sets, function(element) {
    $.merge(cards, Sets.findOne({_id: element}).cards);
    });
    
    // Filter out villager and werewolf roles
    var werewolves = [];
    var villagers = [];
    werewolves = _.filter(cards, function(card) {return card.team === "werewolf";});
    villagers  = _.filter(cards, function(card) {return card.team === "villager";});
    
    // Get random werewolf cards
    var randomSet = [];
    $.merge(randomSet, _.sample(werewolves, numWolves));
    numPlayers -= numWolves;
    
    // Check to see if we have an alpha-wolf, if so add another wolf
    if (_.some(randomSet, function(elem) {return elem.name === "Alpha Wolf";})) {
      randomSet.push(_.sample(_.difference(werewolves, randomSet), 1)[0]);
    }
    
    // Get remaining villager cards
    $.merge(randomSet, _.sample(villagers, numPlayers));
    
    // Add to roleSet local collection
    _.each(randomSet, function(elem){
      roleSet.insert(elem);
    });
    
    
    console.log(numPlayers);
    console.log(randomSet);
  }
});