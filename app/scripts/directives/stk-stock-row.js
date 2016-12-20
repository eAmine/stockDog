'use strict';

/**
 * @ngdoc directive
 * @name stockDogApp.directive:stkStockRow
 * @description
 * # stkStockRow
 */
angular.module('stockDogApp')
  .directive('stkStockRow', function ($timeout, QuoteService) {
    return {
      restrict: 'A',
      require:'^stkStockTable',
      scope:{ stock:'=',isLast:'='},
      link: function postLink(scope, element, attrs,stockTableCtrl) {
        element.tooltip({
          placement:'left',
          title:scope.stock.company.name
        });
        //adds this row to table
        stockTableCtrl.addRow(scope);

        //register this stock
        QuoteService.register(scope.stock);

        //deregister company with the QuoteService
        scope.$on('$destroy',function(){
          stockTableCtrl.removeRow(scope);
          QuoteService.deregister(scope.stock);
        });

        //If this is the last 'stock-row', fetch quotes immediately
        if(scope.isLast){
          $timeout(QuoteService.fetch);
        }

        //watch for changes and recalculate fields
        scope.$watch('stock.shares',function(){
          scope.stock.marketValue=scope.stock.shares * scope.stock.lastPrice;
          scope.stock.dayChange=scope.stock.shares * parseFloat(scope.stock.change);
          scope.stock.save();
        });
      }
    };
  });
