/**
 * Copyright 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * Authors:
 *    - James Sutton
 **/
module.exports = function(RED) {
    "use strict";
    var GrovePiBoard = require('./lib/GrovePiBoard');


    function GrovePiAnalogSensorNode(config) {
        RED.nodes.createNode(this,config);
        // Retrieve the board-config node
       this.boardConfig = RED.nodes.getNode(config.board);
       this.pin = config.pin;
       this.repeat = config.repeat;
       this.log("Analog Sensor: Pin: " + this.pin + ", Repeat: " + this.repeat);

       var node = this;

        if(node.boardConfig){
          // Board has been initialised
          this.log("Configuration Found")
          if(node.boardConfig.board){
            this.log("GrovePiBoard has already been initilised");
          } else {
            this.warn("Not Initislised yet, starting GrovePiBoard");
            node.boardConfig.board = new GrovePiBoard();
          }
          this.log("Can now do stuff!");

          this.sensor = node.boardConfig.board.registerSensor('analog', null, this.pin, this.repeat, function(response){
              var msg = {};
              msg.payload = response;
              node.send(msg);
          });

          this.on('close', function(done) {
              this.log('unregistering analog Sensor');
              this.sensor(function(){
                  this.log('Sensor successfuly un registered.');
                  done();
              });
          });

          node.boardConfig.board.init();

        } else {
          node.error("Node has no configuration!");
        }
    }
    RED.nodes.registerType("grove analog sensor",GrovePiAnalogSensorNode);

    function GrovePiDigitalSensorNode(config) {
        RED.nodes.createNode(this,config);
        // Retrieve the board-config node
       this.boardConfig = RED.nodes.getNode(config.board);
       this.pin = config.pin;
       this.sensor = config.sensor;
       this.repeat = config.repeat;
       this.log("Digital Sensor: Sensor: " + this.sensor + ", Pin: " + this.pin + ", Repeat: " + this.repeat);

       var node = this;

       if(node.boardConfig){
         // Board has been initialised
         this.log("Configuration Found")
         if(node.boardConfig.board){
           this.log("GrovePiBoard has already been initilised");
         } else {
           this.warn("Not Initislised yet, starting GrovePiBoard");
           node.boardConfig.board = new GrovePiBoard();
         }
         this.log("Can now do stuff!");

         this.sensor = node.boardConfig.board.registerSensor('digital', this.sensor, this.pin, this.repeat, function(response){
             var msg = {};
             msg.payload = response;
             node.send(msg);
         });

         this.on('close', function(done) {
             this.log('unregistering digital Sensor');
             this.sensor(function(){
                 this.log('Sensor successfuly un registered.');
                 done();
             });
         });

         node.boardConfig.board.init();

       } else {
         node.error("Node has no configuration!");
       }
    }
    RED.nodes.registerType("grove digital sensor",GrovePiDigitalSensorNode);

    function GrovePiOutputNode(config) {
        RED.nodes.createNode(this,config);
        // Retrieve the board-config node
       this.boardConfig = RED.nodes.getNode(config.board);
       this.pin = config.pin;
       this.repeat = config.repeat;
       this.log("Output: Pin: " + this.pin);

       var node = this;

       if(node.boardConfig){
         // Board has been initialised
         this.log("Configuration Found")
         if(node.boardConfig.board){
           this.log("GrovePiBoard has already been initilised");
         } else {
           this.warn("Not Initislised yet, starting GrovePiBoard");
           node.boardConfig.board = new GrovePiBoard();
         }

         this.on('input', function(msg) {
              node.boardConfig.board.input(this.pin, msg.state);
          });

         this.on('close', function(done) {
             this.log('unregistering analog Sensor');
             this.sensor(function(){
                 this.log('Sensor successfuly un registered.');
                 done();
             });
         });

         node.boardConfig.board.init();

       } else {
         node.error("Node has no configuration!");
       }
    }
    RED.nodes.registerType("grove output",GrovePiOutputNode);

    function GrovePiConfigNode(n) {
       RED.nodes.createNode(this,n);
       this.boardType = n.boardType;
       this.name = n.name;
       this.usedPins = [];
       // this.groveBoard = new grovePiBoard();
   }
   RED.nodes.registerType("board-config",GrovePiConfigNode);
}
