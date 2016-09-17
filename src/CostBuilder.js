import React from 'react';
import $ from 'jquery';
import './CostBuilder.css';

var BASE_URL = "https://shopicruit.myshopify.com/products.json?page=";
var CLOCK = "Clock";
var WATCH = "Watch";
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
            <div className="costSection">
                {costRows}
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
                console.log("we're on page" + pageNum);
                if (data.products.length > 0) {
                    data.products.forEach(function(product) {
                        if (product.product_type === CLOCK || product.product_type === WATCH) {
                            product.variants.forEach(function(variant) {
                                cost += parseFloat(variant.price);
                            });
                        }
                    });
                    console.log("Cost of page: " + pageNum + " = " + cost);
                    var data = this.state.data;
                    data.push({
                        page: pageNum,
                        price: cost
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
    }
});

export default CostBuilder;