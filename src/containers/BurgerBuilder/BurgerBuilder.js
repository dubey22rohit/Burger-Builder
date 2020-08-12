import React , {Component} from 'react';
import Aux from '../../hoc/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
const INGREDIENTS_PRICES = {
    'salad' : 20,
    'bacon' : 40,
    'cheese' : 20,
    'meat' : 80,
}
class BurgerBuilder extends Component{
    state = {
       ingredients : { 
        'salad' : 0,
        'bacon' : 0,
        'cheese' : 0,
        'meat' : 0,
    },
    totalPrice : 50,
    purchasable : false,
    }
    updatePurchaseState(ingredients){
        
        const sum = Object.keys(ingredients).map(igKey=>{
            return ingredients[igKey];
        }).reduce((sum,el)=>{
            return sum + el;
        },0);
        this.setState({purchasable : (sum > 0)})

    }
    addIngredientHandler=(type)=>{
        const oldCount = this.state.ingredients[type]
        const updatedCount = oldCount + 1
        const updatedIngredients = {...this.state.ingredients}
        updatedIngredients[type] = updatedCount
        const priceAddition = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice + priceAddition
        this.setState({totalPrice : newPrice , ingredients : updatedIngredients})
        this.updatePurchaseState(updatedIngredients)

    }
    removeIngredientHandler=(type)=>{
        const oldCount = this.state.ingredients[type]
        if(oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {...this.state.ingredients}
        updatedIngredients[type] =  updatedCount
        const priceRemoval = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice - priceRemoval
        this.setState({totalPrice : newPrice,ingredients : updatedIngredients})
        this.updatePurchaseState(updatedIngredients)
    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        }
        for(let key in disabledInfo){
            disabledInfo[key] = (disabledInfo[key] <= 0)
        }
        return(
            <Aux>
                <Burger ingredients = {this.state.ingredients}/>
                <BuildControls ingredientsAdded = {this.addIngredientHandler} 
                ingredientsSubtracted = {this.removeIngredientHandler}
                disabled = {disabledInfo}
                price = {this.state.totalPrice}
                purchasable = {this.state.purchasable}/>
                
            </Aux>
        );
    }
    
}
export default BurgerBuilder;