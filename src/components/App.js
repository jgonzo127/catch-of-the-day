import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import samplesFishes from '../sample-fishes.js';
import base from '../base';

class App extends React.Component {
	constructor() {
		super();
		this.addFish = this.addFish.bind( this );
		this.updateFish = this.updateFish.bind( this );
		this.removeFish = this.removeFish.bind( this );
		this.loadSamples = this.loadSamples.bind( this );
		this.addToOrder = this.addToOrder.bind( this );
		this.removeFromOrder = this.removeFromOrder.bind( this );
		
		this.state = {
			fishes: {},
			order: {},
		};
	}

	componentWillMount() {
		// this runs right before the app is rendered
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`,
			{
				context: this,
				state: 'fishes'
			});

		// check if there is an order in local storage

		const localStorageRef = localStorage.getItem( `order-${this.props.params.storeId}` );

		if( localStorageRef ) {
			// update our App component's order status
			this.setState({
				order: JSON.parse( localStorageRef )
			});
		}
	}

	componentWillUnmount() {
		base.removeBinding( this.ref );
	}

	componentWillUpdate( nextProps, nextState ) {
		localStorage.setItem( `order-${this.props.params.storeId}`, JSON.stringify( nextState.order ) );
	}

	addFish( fish ) {
		// update state
		const fishes = {...this.state.fishes};
		// add in our new fish
		const timestamp = Date.now();
		fishes[`fish-${timestamp}`] = fish;
		// set state
		this.setState({ fishes });
	}

	updateFish( key, updatedFish ) {
		const fishes = {...this.state.fishes};
		fishes[key] = updatedFish;
		this.setState({fishes});
	}

	removeFish( key ) {
		const fishes = {...this.state.fishes};
		fishes[key] = null;
		this.setState({ fishes });
	}

	loadSamples() {

		this.setState({
			fishes: samplesFishes
		})
	}

	addToOrder( key ) {
		// take a copy of our state
		const order = {...this.state.order};
		// update or add the new number of fish ordered
		order[key] = order[key] + 1 || 1;
		// update our state
		this.setState({ order });
	}

	removeFromOrder( key ) {
		// take a copy of our state
		const order = {...this.state.order};
		// update or add the new number of fish ordered
		delete order[key];
		// update our state
		this.setState({ order });
	}

	render() {
		return(
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market"/>
					<ul className="list-of-fishes">
						{
							Object.keys( this.state.fishes ).map(key=> <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)
						}						
					</ul>
				</div>

					<Order params={this.props.params} fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder} />
					<Inventory addFish={this.addFish} removeFish={this.removeFish} updateFish={this.updateFish} fishes={this.state.fishes} loadSamples={this.loadSamples} />
				
			</div>
		)
	}
}

export default App;