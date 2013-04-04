/*************************/
/**** Private Methods ****/
/*************************/

/*
 * Anything that you need for helper/private use should
 * go here.
 *
 */

/*************************/
/****    isis.Game    ****/
/*************************/

/* 
 * This function will be called when the user changes cities
 * 
 * User Story:
 * Whenever you move cities, the game will have to move the player to 
 * the new city and regenerate the items at that location.
 *
 * Hint:
 * Use this.refreshViews() to reload the UI.
 */
isis.Game.prototype.changeCity = function(newCity) {
  console.log('trying to change city to ' + newCity.name);
  this.currentCity = newCity;
  // Recalculating price of items in each city
  for (var priceIndex = 0; priceIndex < newCity.items.length; priceIndex++) {
    var item = newCity.items[priceIndex];
    item.recalculatePrice();
    }
  this.refreshViews();
  }

/*
 * This function will be called when the user buys an item
 *
 * User Story:
 * A player can buy items in a city. Each item has a cost and can be 
 * bought in bulk.
 *
 * Hint:
 * Use prompt() and confirm() to get and validate user input
 */
isis.Game.prototype.buyItem = function(item) {
  console.log('trying to buy ' + item.name);
  //prompt user for confirmation
  var quantity = parseInt(prompt("How many " + item.name + " do you want to buy?", 1));
  //confirm user input
  var confirmation = confirm("Are you sure you want to buy " + quantity + " " + item.name + "?");
  var totalPrice = quantity * item.currentPrice;
    if (confirmation === true &&  this.agent.money >= totalPrice){
      //add item to agent inventory
      this.agent.inventory.push(item, quantity);
      //subtract item price from agent money
      this.agent.money -= totalPrice;
      //refresh UI view
      this.refreshViews();
    } else {
      alert("Insufficent funds!");
    }
}

/**
 * This function will be called when the user sells an item
 *
 * User Story:
 * A player can sell items in a city. Each item has a cost and can be 
 * sold in bulk.
 *
 * Hint:
 * Use prompt() and confirm() to get and valid user input
 * 
 * @params inventoryItem
 * An AgentInventoryItem which contains the info about the item the game
 * is trying to sell.
 */
isis.Game.prototype.sellItem = function(inventoryItem) {
  var value = inventoryItem.item.currentPrice * inventoryItem.quantity;
  console.log('trying to sell ' + inventoryItem.item.name + ', I have ' + inventoryItem.quantity + ' worth $' + value);
  //prompt user for confirmation
  var quantity = prompt("How many " + inventoryItem.item.name + " do you want to sell?", 1);
  //confirm user input
  var confirmation = confirm("Are you sure you want to sell " + quantity + " " + inventoryItem.item.name + "?");
    if (confirmation === true){
      //remove item from agent inventory
      this.agent.inventory.pop(inventoryItem.item, quantity);
      //add item price to agent money
      this.agent.money += value;
      //refresh UI view
      this.refreshViews();
    }
}


/*
 * This function is called when the game is initialized to produce a list of bad
 * things which could happen to our travelling agent. 
 *
 * Make up a few more bad things that could happen to our agent!
 * A few examples:
 *   Customs Fare Hike (5% tax on all current money)
 *   Search & Seizure (-$5000)
 *
 * N.B.
 * The bad thing needs to follow the same format as the temporary bad thing
 */

isis.Game.prototype.initBadThings = function(badThings) {

  badThings.push({
    name: "Slipped and fell! -$50",
    ohNoes: function(agent) {
      alert("Slipped and fell! -$50");
      agent.money -= 50;
    }
  });

  badThings.push({
    name: "A man with an eyepatch stole inventory in the night... and shot you in the foot.",
    ohNoes: function(agent) {
      alert("A man with an eyepatch stole inventory in the night... and shot you in the foot. Loose 25% of inventory");
      for (var invIndex = 0; invIndex < agent.inventory.length; invIndex++) {
        var inv = agent.inventory.item[invIndex];
        inv.quantity -= inv.quantity * 0.25;
      }
    }
  });

  badThings.push({
    name: "A beautiful femme fatal stole your wallet!",
    ohNoes: function(agent) {
      console.log(this);
      alert("A beautiful femme fatal stole your wallet! -$3000");
      agent.money -= 3000;
    }
  });

  badThings.push({
    name: "Got drunk and forgot where your money was!",
    ohNoes: function(agent) {
      alert("Got drunk and forgot where your money was! -$500");
      agent.money -= 500;
  }  
  }); 

}

/*************************/
/****    isis.Agent   ****/
/*************************/

/*
 * This method returns the player's rank based on the amount of 
 * money the player has.
 *
 * User Story:
 * If the player has less than $500 then they should be ranked as a 'Rookie'.
 * If the player has more than $500 then they should be ranked as an 'Agent'.
 * If the player has more than $1000 then they should be ranked as a 'Top Agent'.
 * If the player has more than $5000 then they should be ranked as a 'Double-0'.
 */

isis.Agent.prototype.getRank = function() { 
  if (this.money >= 5000){return 'Double-0'}
  else if (this.money >= 1000){return 'Top Agent'}
  else if (this.money <= 500){return 'Rookie'}
  else if (this.money >= 500){return 'Agent'}
};

/*
 * This will initialize the agent for your player. Make sure to change
 * this so that you collect the information from the user instead of
 * hard coding it.
 * 
 * Hint:
 * Use prompt() to get user input.
 */
isis.Agent.prototype.init = function() { 
  var userName = prompt("What is your name?", "Sterling Archer");
  this.name = userName;
  var userCodename = prompt("What is your codename?", "Dutchess");
  this.codename = "Codename: \"" + userCodename + "\"";
}



// This runs the game, this HAS to be at the 
// bottom of the file!
$(function() {
  setTimeout(function() {
    isis.init();
  }, 250);
});