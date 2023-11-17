/**
 * A simple implementation of a linked list node.
 */
export default class LinkedListNode {
	/**
	 * Constructor for the LinkedListNode class.
	 *
	 * @param {unknown} value The value stored in the node.
	 */
	constructor(value) {
		/** The value stored in the node. */
		this.value = value;

		/** Whether the node has been traversed by the getCycle function. */
		this.traversed = false;
	}

	/**
	 * Links two nodes together.
	 *
	 * @param {LinkedListNode} node The node with which to link this.
	 */
	linkTo(node) {
		// Links this to node.
		if (!this.node0)
			this.node0 = node;
		else if (!this.node1)
			this.node1 = node;
		else
			throw new Error("A LinkedListNode can only be linked to two other nodes");

		// Links node to this.
		if (!node.node0)
			node.node0 = this;
		else if (!node.node1)
			node.node1 = this;
		else
			throw new Error("A LinkedListNode can only be linked to two other nodes");
	}

	/**
	 * Traverses all nodes, while avoiding backtracking.
	 *
	 * @returns {LinkedListNode[]} An array with the nodes in cyclic order.
	 */
	getCycle() {
		const cycle = [this.value];

		// If there aren't any adjacent nodes.
		if (!(this.node0 || this.node1))
			return cycle;

		let node = this.node0;
		this.traversed = true;

		// Finds next node to traverse until there aren't any.
		while (node && !node.traversed) {
			node.traversed = true;
			cycle.push(node.value);

			if (node.node1 && node.node1.traversed)
				node = node.node0;
			else
				node = node.node1;
		}

		return cycle;
	}
}
