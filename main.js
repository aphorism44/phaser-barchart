


var game = new Phaser.Game(800, 600, Phaser.AUTO, "", { preload: preload, create: create });

function preload() {
    game.load.image("bg", "assets/white.png");
    game.plugin = game.plugins.add(Phaser.Plugin.BarchartPlugin);
    this.testPosArray = game.generateRandomArray(200, 0, 500);
    this.testNegArray = game.generateRandomArray(200, -500, 0);
    this.testSmallArray = game.generateRandomArray(100, 0, 100);
    this.testNewArray = [];
    this.testBothArray = game.generateRandomArray(200, -250, 250);
}

function create() {
    game.add.sprite(0, 0, "bg");
     this.posNum = game.plugin.addChart(this.testPosArray, 75, 150, 200, 100, "Positive Numbers");
    this.negNum = game.plugin.addChart(this.testNegArray, 75, 350, 200, 100, "Negative Numbers");
    this.smallNum = game.plugin.addChart(this.testSmallArray, 325, 100, 200, 100, "All Numbers", true);
    this.advanceNum = game.plugin.addChart(this.testNewArray, 600, 100, 200, 100, "Growing Array");
    this.bigNum = game.plugin.addChart(this.testBothArray, 400, 350, 400, 200, "All Numbers");
    this.gameTimer = game.time.events.loop(1000, game.timerUpdate, this);
}

game.timerUpdate = function() {
    //here I'm just adding a new number to the beginning of some arrays to demonstrate the update function
    this.testSmallArray.unshift(Math.random() * 100);
    this.testNewArray.unshift(Math.random() * 100);
    this.testBothArray.unshift(Math.random() * 500 - 250);
    
    this.smallNum.updateChart(this.testSmallArray);
    this.advanceNum.updateChart(this.testNewArray);
    this.bigNum.updateChart(this.testBothArray);
};

game.generateRandomArray = function(size, low, high) {
    var ra = [], range = Math.abs(high - low);
    for (var i = 0; i < size; i++) {
        ra.push((Math.random() * range) + low);
    }
    return ra;
};
