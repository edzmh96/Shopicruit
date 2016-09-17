import React from 'react';
import $ from 'jquery';
import './CostBuilder.css';

var BASE_URL = "https://shopicruit.myshopify.com/products.json?page=";
var CLOCK = "Clock";
var WATCH = "Watch";
var MAX_ROBOT = "https://cdn.shopify.com/s/files/1/1000/7970/products/Aerodynamic_20Concrete_20Clock_large.png?v=1443055734";
var MIN_ROBOT = "//cdn.shopify.com/s/files/1/1000/7970/products/Incredible_20Cotton_20Watch_large.png?v=1443055762";
var CostBuilder = React.createClass({
    getInitialState: function() {
        return {
            data: []
        };
    },
    componentDidMount: function() {
        this.getPageData(1);
    },
    render: function() {
        var costs = this.state.data;
        var maxCostSection = this.createMaxCostSection(costs);
        var minCostSection = this.createMinCostSection(costs);
        return (
            <div className="allCostSection">
                {maxCostSection}
                {minCostSection}
            </div>
        );
    },
    getPageData: function(pageNum) {
        console.log(BASE_URL + pageNum.toString());
        $.ajax({
            url: BASE_URL + pageNum.toString(),
            dataType: 'json',
            cache: false,
            success: function(data) {
                var cost = 0;
                var minTotalCost = 0;
                console.log("we're on page" + pageNum);
                if (data.products.length > 0) {
                    data.products.forEach(function(product) {
                        if (product.product_type === CLOCK || product.product_type === WATCH) {
                            var minCost = Number.MAX_SAFE_INTEGER;
                            product.variants.forEach(function(variant) {
                                cost += parseFloat(variant.price);
                                minCost = parseFloat(variant.price) < minCost ? parseFloat(variant.price) : minCost;
                            });
                            minTotalCost += minCost;
                        }
                    });
                    console.log("Cost of page: " + pageNum + " = " + cost);
                    var data = this.state.data;
                    data.push({
                        page: pageNum,
                        price: cost,
                        minPrice: minTotalCost
                    });
                    this.setState({
                        data: data
                    });
                    this.getPageData(pageNum + 1);
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("Query Failed: " + status + err.toString());
            }
        })
    },
    createMinCostSection(costs) {
        var totalCost = 0;
        var costRows = costs.map(function(cost) {
            totalCost += cost.minPrice;
            return (
                <p className="cost-row">
                    Page {cost.page} = $ {parseFloat(cost.minPrice).toFixed(2)}
                </p>
            )
        });
        totalCost = parseFloat(totalCost).toFixed(2);
        costRows.push(
            <p className="cost-total">
                Total Cost = $ {totalCost}
            </p>
        );
        return (
            <div className="minCostSection">
                <img src={MIN_ROBOT} className="robot"/>
                <p className="min-intro">
                  Cost to buy cheapest variant of all the watches/clocks in the store:
                </p>
                {costRows}
            </div>
        );
    },
    createMaxCostSection(costs) {
        var totalCost = 0;
        var costRows = costs.map(function(cost) {
            totalCost += cost.price;
            return (
                <p className="cost-row">
                    Page {cost.page} = $ {parseFloat(cost.price).toFixed(2)}
                </p>
            )
        });
        totalCost = parseFloat(totalCost).toFixed(2);
        costRows.push(
            <p className="cost-total">
                Total Cost = $ {totalCost}
            </p>
        );
        return (
            <div className="maxCostSection list-group">
                <img src={MAX_ROBOT} className="robot"/>
                <p className="max-intro">
                  Cost to buy all variants of all the watches/clocks in the store:
                </p>
                {costRows}
            </div>
        );
    }
});

export default CostBuilder;