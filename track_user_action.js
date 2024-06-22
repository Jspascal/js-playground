

/**
 * A stack data structure for storing actions.
 */
export class ActionStack {
    constructor() {
        this.stack = [];
    }

    /**
     * Pushes an action onto the stack.
     * @param {Object} action - The action to push.
     */
    push(action) {
        this.stack.push(action);
    }

    /**
     * Pops the top action off the stack.
     * @returns {Object|null} - The popped action, or null if the stack is empty.
     */
    pop() {
        if (this.isEmpty()) return null;
        return this.stack.pop();
    }

    /**
     * Checks if the stack is empty.
     * @returns {boolean} - True if the stack is empty, false otherwise.
     */
    isEmpty() {
        return this.stack.length === 0;
    }
}

/**
 * A node in a linked list.
 */
export class ListNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

/**
 * A linked list data structure.
 */
export class LinkedList {
    constructor() {
        this.head = null;
    }

    /**
     * Appends a new node with the given data to the end of the list.
     * @param {*} data - The data for the new node.
     */
    append(data) {
        if (!this.head) {
            this.head = new ListNode(data);
            return;
        }

        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = new ListNode(data);
    }

    /**
     * Removes the node with the given data from the list.
     * @param {*} data - The data to identify the node to remove.
     */
    remove(data) {
        if (!this.head) return;

        if (this.head.data === data) {
            this.head = this.head.next;
            return;
        }

        let current = this.head;
        while (current.next && current.next.data !== data) {
            current = current.next;
        }

        if (current.next) {
            current.next = current.next.next;
        }
    }

    /**
     * Deeply compares two objects for equality.
     * @param {Object} obj1 - The first object to compare.
     * @param {Object} obj2 - The second object to compare.
     * @returns {boolean} - True if the objects are deeply equal, false otherwise.
     */
    deepEqual(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    /**
     * Finds the node with the given data.
     * @param {*} data - The data to identify the node.
     * @returns {ListNode|null} - The found node, or null if not found.
     */
    find(data) {
        let current = this.head;
        while (current !== null) {
            if (this.deepEqual(current.data, data)) {
                return current;
            }
            current = current.next;
        }
        return null;
    }
}

/**
 * Represents a user session with undo and redo capabilities.
 */
export class UserSession {
    constructor(userId) {
        this.userId = userId;
        this.undoStack = new ActionStack();
        this.redoStack = new ActionStack();
        this.history = new LinkedList();
        this.state = {
            document: { text: '' },
            posts: []
        };
    }

    /**
     * Retrieves the current state of the session.
     * @returns {Object} - The current state.
     */
    getCurrentState() {
        return this.state;
    }

    /**
     * Performs an action and updates the session state accordingly.
     * @param {Object} action - The action to perform.
     */
    performAction(action) {
        console.log(`Performing action: ${action.description}`);
        action.previousState = JSON.parse(JSON.stringify(this.state));
        switch (action.type) {
            case 'edit':
                this.applyEdit(action.content);
                break;
            case 'post':
                this.postContent(action.content);
                break;
            case 'delete':
                this.deleteContent(action.contentId);
                break;
            case 'render':
                this.renderPost(action.postId);
                break;
            default:
                console.log('Action type not recognized');
        }
        this.undoStack.push(action);
        this.redoStack = new ActionStack();
    }

    /**
     * Applies an edit action to the document or a post.
     * @param {Object} content - The content to be edited.
     */
    applyEdit(content) {
        if (content.id) {
            const postIndex = this.state.posts.findIndex(post => post.id === content.id);
            if (postIndex !== -1) {
                this.state.posts[postIndex].text = content.text;
                console.log(`Post with id ${content.id} updated to: ${content.text}`);
            } else {
                console.log(`Post with id ${content.id} not found for edit.`);
            }
        } else {
            this.state.document.text = content.text;
            console.log(`Document text updated to: ${this.state.document.text}`);
        }
    }

    /**
     * Posts new content to the session state.
     * @param {Object} content - The content to be posted.
     */
    postContent(content) {
        this.state.posts.push(content);
        console.log(`Posted content: ${JSON.stringify(content)}`);
    }

    /**
     * Deletes content from the session state based on the content ID.
     * @param {string} contentId - The ID of the content to be deleted.
     * @returns {Object|null} - The deleted content, or null if not found.
     */
    deleteContent(contentId) {
        const postIndex = this.state.posts.findIndex(post => post.id === contentId);
        if (postIndex !== -1) {
            const deletedPost = this.state.posts.splice(postIndex, 1)[0];
            console.log(`Deleted content with id: ${contentId}`);
            return deletedPost; // Return the deleted post for undo operation
        } else {
            console.log(`Post with id ${contentId} not found for deletion.`);
            return null;
        }
    }

    /**
     * Renders a post based on its ID.
     * @param {string} postId - The ID of the post to render.
     */
    renderPost(postId) {
        const post = this.state.posts.find(post => post.id === postId);
        if (post) {
            console.log(`Rendering post content: ${JSON.stringify(post, null, 2)}`);
        } else {
            console.log(`Post with id ${postId} not found for rendering.`);
        }
    }

    /**
     * Undoes the last action performed in the session.
     */
    undoAction() {
        const lastAction = this.undoStack.pop();
        if (!lastAction) {
            console.log('No actions to undo.');
            return;
        }

        switch (lastAction.type) {
            case 'edit':
                this.state = lastAction.previousState;
                break;
            case 'post':
                this.deleteContent(lastAction.content.id);
                break;
            case 'delete':
                this.state.posts.push(lastAction.previousState);
                break;
            default:
                return;
        }

        this.redoStack.push(lastAction);
    }

    /**
     * Redoes the last action that was undone in the session.
     */
    redoAction() {
        const lastUndoneAction = this.redoStack.pop();

        if (!lastUndoneAction) {
            console.log('No actions to redo.');
            return;
        }

        this.performAction(lastUndoneAction);

        this.undoStack.pop();

        console.log(`Redone action: ${lastUndoneAction.description}`);
    }

    /**
     * Simulates visiting a page and adds it to the history.
     * @param {Object} page - The page to visit.
     */
    visitPage(page) {
        console.log(`Visiting page: ${page.url}`);
        this.history.append(page);

        this.renderPageContent(page.content);
    }

    /**
     * Navigates back to the previous page in the history.
     */
    navigateBack() {
        let current = this.history.head;

        if (!current || !current.next) return;

        while (current.next && current.next.next) {
            current = current.next;
        }

        const previousPage = current.data;

        console.log(`Navigating back to: ${previousPage.url}`);

        this.history.remove(current.next.data);

        this.renderPageContent(previousPage.content);
    }

    /**
     * Renders the content of a page.
     * @param {Object} content - The content to render.
     */
    renderPageContent(content) {
        console.log(`Rendering page content: ${JSON.stringify(content, null, 2)}`);
    }
}

