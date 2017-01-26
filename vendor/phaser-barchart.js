(function (Phaser) {
    "use strict";

    Phaser.Plugin.BarchartPlugin = function (game, parent) {
        Phaser.Plugin.call(this, game, parent);
    };
    
    Phaser.Plugin.BarchartPlugin.prototype = Object.create(Phaser.Plugin.prototype);
    Phaser.Plugin.BarchartPlugin.prototype.constructor = Phaser.Plugin.SamplePlugin;
    
    Phaser.Plugin.BarchartPlugin.prototype.addChart = function (valueArray, x, y, width, height, label, hideLabels) {
        var c = new this.Chart(x, y, width, height, label, hideLabels);
        c.updateChart = this.updateChart;
        c.updateChart(valueArray);
        return c;
    };
    
    Phaser.Plugin.BarchartPlugin.prototype.Chart = function ( x, y, width, height, label, hideLabels) {
        //valueArray is an array of integers to be graphed
        this.x = x;
        this.y = y;
        this.hideLabels = hideLabels;
        this.width = width;
        this.height = height;
        this.labelText = label;
        this.graphGroup = game.add.group();
        this.graphLabel = game.add.text(this.x, this.y - 30, this.hideLabels? "": this.labelText, {
            fill: "#000000"
            , font: "Times New Roman"
            , fontSize: 24
        });
        this.lowYAxis = game.add.text(this.x, this.y + this.height - 20, "", {
            fill: "#000000"
            , font: "Times New Roman"
            , fontSize: 18
        });
        this.highYAxis = game.add.text(this.x, this.y, "", {
            fill: "#000000"
            , font: "Times New Roman"
            , fontSize: 18
        });
        
        return this;
    };
    
    Phaser.Plugin.BarchartPlugin.prototype.updateChart = function (valueArray) {
        /*NOTE - when the number of graphed points exceeds half the width, the display
        degrades. The below code removes these extra points from the end of the array.*/
        this.vArray = valueArray;
        if (this.vArray.length > Math.floor(this.width / 2))
            this.vArray = this.vArray.slice(0, Math.floor(this.width / 2));
        this.graphGroup = game.add.group();
        this.graphGraphics = game.add.graphics(this.x, this.y);
        this.graphGraphics.beginFill(0x000000);
        this.graphGraphics.drawRect(0, 0, this.width, this.height);
        this.arrayLength = Math.max(this.vArray.length, 1);
        this.barWidth = this.width / this.arrayLength;
        this.minValue = this.vArray.reduce(function(a, b) { return a < b? a: b; },0);
        this.maxValue = this.vArray.reduce(function(a, b) { return a > b? a: b; }, 0);
        this.lowYAxis.x = this.x - 10 - (5 * this.minValue.toLocaleString().length);
        this.highYAxis.x = this.x -10 - (5 * this.maxValue.toLocaleString().length);
        if (!this.hideLabels) {
            this.lowYAxis.text = Math.ceil(this.minValue).toLocaleString();
            this.highYAxis.text = Math.floor(this.maxValue).toLocaleString();
        }
        //if the nums are all pos/neg, zero will appear somewhere on the y-axis
        this.posSpread = Math.max(this.maxValue, 0);
        this.negSpread = Math.max(-this.minValue, 0);
        this.eachPoint = this.height / (this.posSpread + this.negSpread);
        //from 0 to zeroY are positive values; from zeroY to height are negative numbers
        this.zeroY = (this.height / (this.posSpread + this.negSpread)) * this.posSpread;
        //place bars for each value
        for (var i = 0; i < this.arrayLength; i++) {
            var barLength = this.eachPoint * Math.abs(this.vArray[i]);
            if (this.vArray[i] < 0) {
                this.graphGraphics.beginFill(0xdb3315);
                this.graphGraphics.drawRect(this.barWidth * i, this.zeroY, this.barWidth - 1, barLength);
            } else if (this.vArray[i] > 0) {
                this.graphGraphics.beginFill(0x43db3d);
                this.graphGraphics.drawRect(this.barWidth * i, this.zeroY - barLength, this.barWidth - 1, barLength);
            }
        } //end bar for loop
        
        this.graphGroup.add(this.graphGraphics);
    };
}(Phaser));