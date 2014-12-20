define(['knockout', 'underscore', 'rdfstore'], function(ko, _, rdfstore) {
	'use strict';

	// Create state object (singleton)
	var state = {
		store: rdfstore.create(),
		// isInitialized: ko.observable(false),
		// transfers: ko.observableArray([]),
		// agents: ko.observableArray([]),
		// events: ko.observableArray([]),

		// setLoading: function(isInitialized) {
		// 	this.isInitialized(isInitialized);
		// },
		// sort: function(a) {
		// 	a.sort(function(left, right) { return left().name.localeCompare(right().name); });
		// },
		// sortEvents: function(a) {
		// 	a.sort(function(left, right) { return left().time.localeCompare(right().time); });
		// },
		// addAgent: function(agent) {
		// 	this.agents.push(ko.observable(agent));
		// 	this.sort(this.agents);
		// },
		// addEvent: function(event) {
		// 	this.events.push(ko.observable(event));
		// 	this.sortEvents(this.events);
		// },
		// addTransfer: function(transfer) {
		// 	this.transfers.push(ko.observable(transfer));
		// 	this.sort(this.transfers);
		// },
		// updateAgent: function(agent) {
		// 	for (var i = 0; i < this.agents().length; i++) {
		// 		if (this.agents()[i]().id === agent.id) {
		// 			this.agents()[i](agent);
		// 		}
		// 	}
		// },
		// updateEvent: function(event) {
		// 	for (var i = 0; i < this.events().length; i++) {
		// 		if (this.events()[i]().id === event.id) {
		// 			this.events()[i](event);
		// 		}
		// 	}
		// },
		// updateTransfer: function(transfer) {
		// 	for (var i = 0; i < this.transfers().length; i++) {
		// 		if (this.transfers()[i]().id === transfer.id) {
		// 			this.transfers()[i](transfer);
		// 		}
		// 	}
		// },
		// removeAgent: function(agent, fromServer) {
		// 	if (fromServer) {
		// 		this.agents.remove(function(a) { return a().id == agent; });
		// 	}
		// 	else {
		// 		socket.emit('delete', 'agent', agent.id, function(err, result) {
		// 			if (err) {
		// 				console.log('Failed to remove agent: ' + err);
		// 			}
		// 			else {
		// 				console.log('Remove agent succeeded: ' + JSON.stringify(result));
		// 			}
		// 		});
		// 	}
		// },
		// removeEvent: function(event, fromServer) {
		// 	if (fromServer) {
		// 		this.events.remove(function(a) { return a().id == event; });
		// 	}
		// 	else {
		// 		socket.emit('delete', 'event', event.id, function(err, result) {
		// 			if (err) {
		// 				console.log('Failed to remove event: ' + err);
		// 			}
		// 			else {
		// 				console.log('Remove event succeeded: ' + JSON.stringify(result));
		// 			}
		// 		});
		// 	}
		// },
		// removeTransfer: function(transfer, fromServer) {
		// 	if (fromServer) {
		// 		this.transfers.remove(function(a) { return a().id == transfer; });
		// 	}
		// 	else {
		// 		socket.emit('delete', 'transfer', transfer.id, function(err, result) {
		// 			if (err) {
		// 				console.log('Failed to remove transfer: ' + err);
		// 			}
		// 			else {
		// 				console.log('Remove transfer succeeded: ' + JSON.stringify(result));
		// 			}
		// 		});
		// 	}
		// },
		// saveTransfer: function(transfer) {
		// 	if (transfer.id && transfer.id > 0) {
		// 		// Update
		// 		socket.emit('update', 'transfer', transfer.id, transfer, function(err, result) {
		// 			if (err) {
		// 				console.log('Failed to update transfer: ' + err);
		// 			}
		// 			else {
		// 				console.log('Update transfer succeeded: ' + JSON.stringify(result));
		// 			}
		// 		});
		// 	}
		// 	else {
		// 		// Create
		// 		socket.emit('add', 'transfer', transfer, function(err, result) {
		// 			if (err) {
		// 				console.log('Failed to add transfer: ' + err);
		// 			}
		// 			else {
		// 				console.log('Create transfer succeeded: ' + JSON.stringify(result));
		// 			}
		// 		});
		// 	}
		// },
		// getAgent: function(id) {
		// 	var result = 'No agent with id ' + id + ' found';
		// 	for (var i = 0; i < this.agents().length; i++) {
		// 		if (this.agents()[i]().id == id) {
		// 			result = this.agents()[i];
		// 		}
		// 	}
		// 	return result;
		// },
		// isSynchronized: function(transfer, agent) {
		// 	return _.some(transfer.synced, function isSynced(sync) {
		// 		return agent.id === sync.agentId && transfer.version === sync.version;
		// 	});
		// }
		last: false
	};

	// // Initialize current state
	// async.parallel([
	// 	// Get transfers
	// 	function(callback) {
	// 		socket.emit('list', 'transfer', function(err, result) {
	// 			if (! err) {
	// 				console.log('Got transfer list (' + result.length + ')');
	// 				for (var i = 0; i < result.length; i++) {
	// 					state.addTransfer(result[i]);
	// 				}
	// 				callback(null);
	// 			}
	// 			else {
	// 				callback(err);
	// 			}
	// 		});
	// 	},
	// 	// Get agents
	// 	function(callback) {
	// 		socket.emit('list', 'agent', function(err, result) {
	// 			if (! err) {
	// 				console.log('Got agents list (' + result.length + ')');
	// 				for (var i = 0; i < result.length; i++) {
	// 					state.addAgent(result[i]);
	// 				}
	// 				callback(null);
	// 			}
	// 			else {
	// 				callback(err);
	// 			}
	// 		});
	// 	},
	// 	// Get events
	// 	function(callback) {
	// 		socket.emit('list', 'event', function(err, result) {
	// 			if (! err) {
	// 				console.log('Got events list (' + result.length + ')');
	// 				for (var i = 0; i < result.length; i++) {
	// 					state.addEvent(result[i]);
	// 				}
	// 				callback(null);
	// 			}
	// 			else {
	// 				callback(err);
	// 			}
	// 		});
	// 	}
	// ], function(err) {
	// 	if (! err) {
	// 		state.isInitialized(true);
	// 		console.log('Initialized and ready');
	// 	}
	// 	else {
	// 		console.log('Initialization failed');
	// 		console.warn(err);
	// 	}
	// });
	// // Subscribe to events from server
	// socket.on('connect', function(e) {
	// 	console.log('socket: connected to server: ' + e);
	// });
	// socket.on('add', function(e) {
	// 	console.log('socket: added');
	// 	console.log(e);
	// 	if (e.resourceType === 'transfer') {
	// 		state.addTransfer(e.transfer);
	// 	}
	// 	else if (e.resourceType === 'agent') {
	// 		state.addAgent(e.agent);
	// 	}
	// 	else if (e.resourceType === 'event') {
	// 		state.addEvent(e.event);
	// 	}
	// });
	// socket.on('update', function(e) {
	// 	console.log('socket: updated: ' + e);
	// 	console.log(e);
	// 	if (e.resourceType === 'transfer') {
	// 		state.updateTransfer(e.transfer);
	// 	}
	// 	else if (e.resourceType === 'agent') {
	// 		state.updateAgent(e.agent);
	// 	}
	// 	else if (e.resourceType === 'event') {
	// 		state.updateEvent(e.event);
	// 	}
	// });
	// socket.on('delete', function(e) {
	// 	console.log('socket: deleted: ' + e);
	// 	console.log(e);
	// 	if (e.resourceType === 'transfer') {
	// 		state.removeTransfer(e.transfer, true);
	// 	}
	// 	else if (e.resourceType === 'agent') {
	// 		state.removeAgent(e.agent, true);
	// 	}
	// 	else if (e.resourceType === 'event') {
	// 		state.removeEvent(e.event, true);
	// 	}
	// });
	
	// Return state object (singleton)
	return state;
});