import React from 'react';
import BuildControl from './BuildControl/BuildControl';
import classes from './BuildControls.module.css';

const controls = [
    {label : 'Salad' , type : 'salad'},
    {label : 'Bacon' , type : 'bacon'},
    {label : 'Cheese' , type : 'cheese'},
    {label : 'Meat' , type : 'meat'},
]
const buildControls = (props)=> (
    <div className = {classes.BuildControls}>
        <p>Current Price : <b>{props.price.toFixed(2)}</b></p>
        {controls.map((ctrl)=> (
            <BuildControl key = {ctrl.label} label = {ctrl.label} 
            added = {() => props.ingredientsAdded(ctrl.type)} 
            subtracted = {() => props.ingredientsSubtracted(ctrl.type)}
            disabled = {props.disabled[ctrl.type]}/>
        ))}
        <button disabled = {!props.purchasable} className = {classes.OrderButton}>ORDER NOW</button>

    </div>
);
export default buildControls