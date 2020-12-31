class LinkedListNode {
    constructor(value) {
        this.value = value;
        this.traversed = false;
    }
	
    linkTo(node) {
        //Links this to node.
        if (!this.node0)
            this.node0 = node;
        else if (!this.node1)
            this.node1 = node;
        else
            throw new Error("A LinkedListNode can only be linked to two other nodes!");
			
        //Links node to this.
        if (!node.node0)
            node.node0 = this;
        else if (!node.node1)
            node.node1 = this;
        else
            throw new Error("A LinkedListNode can only be linked to two other nodes!");
    }
	
    //Traverses all nodes, while avoiding backtracking.
    getCycle() {
        const cycle = [this.value];
        if (!this.node0)
            return cycle;
			
        let node = this.node0;
        this.traversed = true;
		
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