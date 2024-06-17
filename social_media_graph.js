class UserGraph {
    constructor() {
        this.adjacencyList = {};
        this.userInterests = {};
    }

    addUser(userId) {
        if (!this.adjacencyList[userId]) this.adjacencyList[userId] = [];
    }

    addConnection(userId1, userId2) {
        this.adjacencyList[userId1].push(userId2);
        this.adjacencyList[userId2].push(userId1);
    }

    removeUser(userId) {
        while (this.adjacencyList[userId]) {
            const adjacentUserId = this.adjacencyList[userId].pop();
            this.removeConnection(adjacentUserId, userId);
        }
        delete this.adjacencyList[userId];
    }

    removeConnection(userId1, userId2) {
        this.adjacencyList[userId1] = this.adjacencyList[userId1].filter(
            userId => userId !== userId2
        );
        this.adjacencyList[userId2] = this.adjacencyList[userId2].filter(
            userId => userId !== userId1
        );
    }

    setUserInterests(userId, interests) {
        this.userInterests[userId] = interests;
    }
}

class TagNode {
    constructor(value) {
        this.value = value;
        this.children = [];
        this.contentIds = [];
    }

    addContent(contentId) {
        this.contentIds.push(contentId);
    }
}

class TagTree {
    constructor() {
        this.root = new TagNode('root');
    }

    addTag(parentTagValue, newTagValue) {
        const parentTagNode = this.findTag(this.root, parentTagValue);
        if (parentTagNode) {
            const newTagNode = new TagNode(newTagValue);
            parentTagNode.children.push(newTagNode);
        } else {
            console.log(`Parent tag: ${parentTagValue} not found`);
        }
    }

    findTag(tagNode, tagValue) {
        if (tagNode.value === tagValue) return tagNode;
        for (const child of tagNode.children) {
            const found = this.findTag(child, tagValue);
            if (found) return found;
        }
        return null;
    }
}

function findContentByTag(tagNode, tagToFind) {
    if (tagNode.value === tagToFind) {
        console.log(`Content for tag: ${tagToFind}`, tagNode.contentIds);
    }
    for (const child of tagNode.children) {
        findContentByTag(child, tagToFind);
    }
}

function dfsConnections(graph, userId, visitedUsers) {
    if (!visitedUsers.has(userId)) {
        visitedUsers.add(userId);
        const connections = graph[userId];
        for (const connectionId of connections) {
            dfsConnections(graph, connectionId, visitedUsers);
        }
    }
}

function generateUserFeed(userGraph, tagTree, userId, interestedTags) {
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

const userGraph = new UserGraph();
userGraph.addUser('Joseph');
userGraph.addUser('Pascal');

const tagTree = new TagTree();
tagTree.addTag('root', 'IT');
tagTree.addTag('IT', 'JavaScript');
tagTree.addTag('JavaScript', 'DSA');

userGraph.addConnection('Joseph', 'Pascal');

userGraph.setUserInterests('Joseph', ['JavaScript']);
userGraph.setUserInterests('Pascal', ['DSA']);

const javascriptTag = tagTree.findTag(tagTree.root, 'JavaScript');
if (javascriptTag) {
    javascriptTag.addContent('Post about closures');
    javascriptTag.addContent('Article on async/await');
}

const dsaTag = tagTree.findTag(tagTree.root, 'DSA');
if (dsaTag) {
    dsaTag.addContent('Video on algorithms');
}

findContentByTag(tagTree.root, 'JavaScript');

generateUserFeed(userGraph, tagTree, 'Joseph');