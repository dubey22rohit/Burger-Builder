import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders';
const INGREDIENTS_PRICES = {
    'salad': 20,
    'bacon': 40,
    'cheese': 20,
    'meat': 80,
}
class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 50,
        purchasable: false,
        pruchasing: false,
        loading : false,
        error : false
    }
    componentDidMount(){
        axios.get("https://burgerbuilder-679e6-default-rtdb.firebaseio.com/ingredients.json").then((res)=>{
            this.setState({ingredients : res.data});
        }).catch(err=>{
            this.setState({error : true})
        })
    }
    updatePurchaseState(ingredients) {

        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        }).reduce((sum, el) => {
            return sum + el;
        }, 0);
        this.setState({ purchasable: (sum > 0) })

    }
    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        const updatedCount = oldCount + 1
        const updatedIngredients = { ...this.state.ingredients }
        updatedIngredients[type] = updatedCount
        const priceAddition = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice + priceAddition
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
        this.updatePurchaseState(updatedIngredients)

    }
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = { ...this.state.ingredients }
        updatedIngredients[type] = updatedCount
        const priceRemoval = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice - priceRemoval
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
        this.updatePurchaseState(updatedIngredients)
    }
    purchaseHandler = () => {
        this.setState({ pruchasing: true })
    }
    purchaseCancelHandler = () => {
        this.setState({ pruchasing: false })
    }
    purchaseContinueHandler = () => {
        //alert('You continued!')
        
        const queryParams = [];
        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + "=" + encodeURIComponent(this.state.ingredients[i]))
        }
        queryParams.push('price=' + this.state.totalPrice)
        const queryString = queryParams.join('&')
        this.props.history.push({
            pathname : '/checkout',
            search : '?' + queryString
        })
    }
    render() {
        let orderSummary = null;
        
        
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = (disabledInfo[key] <= 0)
        }
        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>
        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                <BuildControls ingredientsAdded={this.addIngredientHandler}
                    ingredientsSubtracted={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    purchasable={this.state.purchasable}
                    ordered={this.purchaseHandler}
                />
                </Aux>
            );
            orderSummary = <OrderSummary ingredients={this.state.ingredients}
        purchaseContinue={this.purchaseContinueHandler} purchaseCancel={this.purchaseCancelHandler} 
        price = {this.state.totalPrice}
        />
        }
        if(this.state.loading){
            orderSummary = <Spinner/>
        }
        return (
            <Aux>
                <Modal show={this.state.pruchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}

            </Aux>
        );
    }

}
export default withErrorHandler(BurgerBuilder,axios);