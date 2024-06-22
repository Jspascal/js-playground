/**
 * Represents a graph of users where each user is a node and connections between users are edges.
 */
export class UserGraph {
    /**
     * Initializes a new instance of the UserGraph class.
     */
    constructor() {
        this.adjacencyList = {};
        this.userInterests = {};
    }

    /**
     * Adds a new user to the graph.
     * @param {string} userId - The unique identifier for the user.
     */
    addUser(userId) {
        if (!this.adjacencyList[userId]) this.adjacencyList[userId] = [];
    }

    /**
     * Creates a bidirectional connection between two users.
     * @param {string} userId1 - The unique identifier for the first user.
     * @param {string} userId2 - The unique identifier for the second user.
     */
    addConnection(userId1, userId2) {
        this.adjacencyList[userId1].push(userId2);
        this.adjacencyList[userId2].push(userId1);
    }

    /**
     * Removes a user and all their connections from the graph.
     * @param {string} userId - The unique identifier for the user to remove.
     */
    removeUser(userId) {
        if (this.adjacencyList[userId]) {
            // Remove the user from the adjacency lists of all connected users
            this.adjacencyList[userId].forEach(adjacentUserId => {
                this.adjacencyList[adjacentUserId] = this.adjacencyList[adjacentUserId].filter(
                    id => id !== userId
                );
            });
            // Finally, delete the user's own adjacency list
            delete this.adjacencyList[userId];
        }
        // Also delete the user's interests to free up memory
        delete this.userInterests[userId];
    }


    /**
     * Removes the connection between two users.
     * @param {string} userId1 - The unique identifier for the first user.
     * @param {string} userId2 - The unique identifier for the second user.
     */
    removeConnection(userId1, userId2) {
        // Check if both users exist in the adjacency list before attempting to filter
        if (this.adjacencyList[userId1]) {
            this.adjacencyList[userId1] = this.adjacencyList[userId1].filter(
                id => id !== userId2
            );
        }
        if (this.adjacencyList[userId2]) {
            this.adjacencyList[userId2] = this.adjacencyList[userId2].filter(
                id => id !== userId1
            );
        }
    }


    /**
     * Sets the interests for a user.
     * @param {string} userId - The unique identifier for the user.
     * @param {string[]} interests - An array of interests.
     */
    setUserInterests(userId, interests) {
        this.userInterests[userId] = interests;
    }
}

/**
 * Represents a node in a tag tree, which can contain content IDs.
 */
export class TagNode {
    /**
     * Initializes a new instance of the TagNode class.
     * @param {string} value - The value of the tag.
     */
    constructor(value) {
        this.value = value;
        this.children = [];
        this.contentIds = [];
    }

    /**
     * Adds a content ID to the tag node.
     * @param {string} contentId - The content ID to add.
     */
    addContent(contentId) {
        this.contentIds.push(contentId);
    }
}

/**
 * Represents a hierarchical tree structure of tags.
 */
export class TagTree {
    /**
     * Initializes a new instance of the TagTree class.
     */
    constructor() {
        this.root = new TagNode('root');
    }

    /**
     * Adds a new tag as a child of a specified parent tag.
     * @param {string} parentTagValue - The value of the parent tag.
     * @param {string} newTagValue - The value of the new tag to add.
     */
    addTag(parentTagValue, newTagValue) {
        const parentTagNode = this.findTag(this.root, parentTagValue);
        if (parentTagNode) {
            const newTagNode = new TagNode(newTagValue);
            parentTagNode.children.push(newTagNode);
        } else {
            console.log(`Parent tag: ${parentTagValue} not found`);
        }
    }

    /**
     * Finds a tag node by its value, starting from a given node.
     * @param {TagNode} tagNode - The starting node for the search.
     * @param {string} tagValue - The value of the tag to find.
     * @returns {TagNode|null} The found tag node or null if not found.
     */
    findTag(tagNode, tagValue) {
        if (tagNode.value === tagValue) return tagNode;
        for (const child of tagNode.children) {
            const found = this.findTag(child, tagValue);
            if (found) return found;
        }
        return null;
    }
}

/**
 * Finds and logs content IDs associated with a specific tag.
 * @param {TagNode} tagNode - The starting node for the search.
 * @param {string} tagToFind - The tag for which to find content.
 */
export function findContentByTag(tagNode, tagToFind) {
    if (tagNode.value === tagToFind) {
        console.log(`Content for tag: ${tagToFind}`, tagNode.contentIds);
    }
    for (const child of tagNode.children) {
        findContentByTag(child, tagToFind);
    }
}

/**
 * Performs a depth-first search to find all connections for a given user.
 * @param {Object} graph - The adjacency list of the graph.
 * @param {string} userId - The user ID to start the search from.
 * @param {Set<string>} visitedUsers - A set to keep track of visited users.
 */
export function dfsConnections(graph, userId, visitedUsers) {
    if (!visitedUsers.has(userId)) {
        visitedUsers.add(userId);
        const connections = graph[userId];
        for (const connectionId of connections) {
            dfsConnections(graph, connectionId, visitedUsers);
        }
    }
}

/**
 * Generates a feed of content for a user based on their interests and connections.
 * @param {UserGraph} userGraph - The user graph.
 * @param {TagTree} tagTree - The tag tree.
 * @param {string} userId - The user ID for whom to generate the feed.
 * @param {string[]} interestedTags - An array of tags the user is interested in.
 */
export function generateUserFeed(userGraph, tagTree, userId, interestedTags) {
    const visitedUsers = new Set();
    const feedContents = [];

    dfsConnections(userGraph.adjacencyList, userId, visitedUsers);
    const userInterests = userGraph.userInterests[userId] || [];

    visitedUsers.forEach(connectedUserId => {
        const connectedUserInterests = userGraph.userInterests[connectedUserId] || [];
        connectedUserInterests.forEach(tag => {
            const tagNode = tagTree.findTag(tagTree.root, tag);
            if (tagNode) {
                tagNode.contentIds.forEach(contentId => {
                    if (!feedContents.includes(contentId)) {
                        feedContents.push(contentId);
                    }
                });
            }
        });
    });

    console.log(`Feed for ${userId}:`, feedContents);
}
