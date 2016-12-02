'use strict';

/**
 * @ngdoc service
 * @name stockDogApp.WatchlistService
 * @description
 * # WatchlistService
 * Service in the stockDogApp.
 */
angular.module('stockDogApp')
  .service('WatchlistService', function () {
    var WatchlistModel={
        addStock:function(stock){
            var existingStock=_.find(this.stocks,function(s){
                return s.company.symbol===stock.company.symbol;
            });
            if(existingStock){
                existingStock.shares+=stock.shares;
            }
            else{
                _.assignIn(stock,StockModel);
                this.stocks.push(stock);
            }
            this.recalculate();
            saveModel();
        },
        removeStock:function(stock){
            _.remove(this.stocks,function(s){
                return s.company.symbol===stock.company.symbol;
            });
            this.recalculate();
            saveModel();
        },
        recalculate: function () {
            var calcs = _.reduce(this.stocks, function (calcs, stock) {
            calcs.shares += stock.shares;
            calcs.marketValue += stock.marketValue;
            calcs.dayChange += stock.dayChange;
            return calcs;
            }, { shares: 0, marketValue: 0, dayChange: 0 });
this.shares = calcs.shares;
this.marketValue = calcs.marketValue;
this.dayChange = calcs.dayChange;
}
};
  

    var loadModel= function(){
    	var model={
    		watchlists:localStorage['StockDog.watchlists']?JSON.parse(localStorage['StockDog.watchlists']):[],
    		nextId:localStorage['StockDog.nextId']?parseInt(localStorage['StockDog.nextId']):0
    	};
        _.each(model.watchlists, function (watchlist) {
            _.assignIn(watchlist, WatchlistModel);
                _.each(watchlist.stocks, function (stock) {
                    _.assignIn(stock, StockModel);
                });
        });
    	return model;
    };

    var saveModel=function(){
    	localStorage['StockDog.watchlists']=JSON.stringify(Model.watchlists);
    	localStorage['StockDog.nextId']=Model.nextId;
    };

    var findById=function(listId){
    	return _.find(Model.watchlists,function(watchlist){
    		return watchlist.id === parseInt(listId);
    	});
    };
    this.query=function(listId){
    	if(listId){
    		return findById(listId);
    	}
    	else{
    		return Model.watchlists;
    	}
    };

    this.save=function(watchlist){
    	watchlist.id=Model.nextId++;
        watchlist.stocks = [];
        _.assignIn(watchlist, WatchlistModel);
    	Model.watchlists.push(watchlist);
		saveModel();
    };

    this.remove = function (watchlist) {
		_.remove(Model.watchlists, function (list) {
		return list.id === watchlist.id;
		});
		saveModel();
	};
    var StockModel = {
        save: function () {
            var watchlist = findById(this.listId);
            watchlist.recalculate();
            saveModel();
        }
    };

    
	var Model=loadModel();

});
