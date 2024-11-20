/**
 * A stack data structure for storing actions.
 *
 * Each action object has the following structure:
 *
 * ```javascript
 * {
 *   type: 'post' | 'edit' | 'delete',
 *   content: {
 *     id: number,
 *     text: string
 *   },
 *   description: string
 * }
 * ```
 */
export class ActionStack {
  /**
   * An array of actions that have been pushed onto the stack.
   *
   * @type {{
   *   type: string;
   *   content: {
   *     id: number;
   *     text: string;
   *   };
   *   description: string;
   * }[]}
   */
  stack = [];

  constructor() {
    this.stack = [];
  }

  /**
   * Pushes an action onto the stack.
   *
   * @param {Object} action - The action to push.
   * @param {string} action.type - The type of action, e.g., "post", "edit", "delete".
   * @param {Object} action.content - The content associated with the action.
   * @param {number} action.content.id - The ID of the content.
   * @param {string} action.content.text - The text content.
   * @param {string} action.description - A description of the action.
   */
  push(action) {
    this.stack.push(action);
  }

  /**
   * Pops the top action off the stack.
   * @returns {{
   *   type: string;
   *   content: {
   *     id: number;
   *     text: string;
   *   };
   *   description: string;
   *   previousState: {
   *     document: {
   *     text: string;
   *     };
   *     posts: {
   *        id: number;
   *        text: string;
   *     }[];
   *  } | null;
   * }} - The popped action, or null if the stack is empty.
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
  /**
   * The data stored in the node.
   * @type {{
   *  url: string;
   *  content: {
   *     url: string;
   *     text: string;
   *   }
   * }}
   */
  data;

  /**
   * Reference to the next node in the linked list.
   * @type {ListNode | null}
   */
  next = null;

  constructor(data) {
    this.data = data;
  }
}

/**
 * A linked list data structure.
 */
export class LinkedList {
  /**
   * @type {ListNode|null}
   */
  constructor() {
    /** @type {ListNode} */
    this.head = null;
  }

  /**
   * Appends a new node with the given data to the end of the list.
   * @param {{
   *  url: string;
   *  content: {
   *     url: string;
   *     text: string;
   *   }
   * }} data - The data for the new node.
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
   * @param {{
   *  url: string;
   *  content: {
   *     url: string;
   *     text: string;
   *   }
   * }} data - The data to identify the node to remove.
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
   * @param {ListNode} obj1 - The first object to compare.
   * @param {ListNode} obj2 - The second object to compare.
   * @returns {boolean} - True if the objects are deeply equal, false otherwise.
   */
  deepEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  /**
   * Finds the node with the given data.
   * @param {{
   *  url: string;
   *  content: {
   *     url: string;
   *     text: string;
   *   }
   * }} data - The data to identify the node.
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
  /**
   * The unique identifier of the user associated with this editor.
   * @type {number}
   */
  userId;

  /**
   * The undo stack, storing actions that can be undone.
   * @type {ActionStack}
   */
  undoStack;

  /**
   * The redo stack, storing actions that can be redone.
   * @type {ActionStack}
   */
  redoStack;

  /**
   * The history of the editor's state changes.
   * @type {LinkedList}
   */
  history;

  /**
   * The current state of the editor, including document and posts.
   * @type {{
   *   document: { text: string },
   *   posts: {
   *     id: number;
   *     text: string;
   *   }[]
   * }}
   */
  state;

  /**
   * @param {number} userId - The unique identifier of the user.
   */
  constructor(userId) {
    this.userId = userId;
    this.undoStack = new ActionStack();
    this.redoStack = new ActionStack();
    this.history = new LinkedList();
    this.state = {
      document: { text: "" },
      posts: [],
    };
  }

  /**
   * Retrieves the current state of the session.
   * @returns {{
   *   document: { text: string },
   *   posts: []
   * }} - The current state.
   */
  getCurrentState() {
    return this.state;
  }

  /**
   * Performs an action and updates the session state accordingly.
   * @param {{
   *   type: string;
   *   content: {
   *     id: number;
   *     text: string;
   *   };
   *   description: string;
   *   previousState: {
   *     document: {
   *     text: string;
   *     };
   *     posts: {
   *        id: number;
   *        text: string;
   *     }[];
   *  } | null;
   * }} action - The action to perform.
   */
  performAction(action) {
    console.log(`Performing action: ${action.description}`);
    action.previousState = JSON.parse(JSON.stringify(this.state));
    switch (action.type) {
      case "edit":
        this.applyEdit(action.content);
        break;
      case "post":
        this.postContent(action.content);
        break;
      case "delete":
        this.deleteContent(action.contentId);
        break;
      case "render":
        this.renderPost(action.postId);
        break;
      default:
        console.log("Action type not recognized");
    }
    this.undoStack.push(action);
    this.redoStack = new ActionStack();
  }

  /**
   * Applies an edit action to the document or a post.
   * @param {{
   *     id: number;
   *     text: string;
   *   }} content - The content to be edited.
   */
  applyEdit(content) {
    if (content.id) {
      const postIndex = this.state.posts.findIndex(
        (post) => post.id === content.id
      );
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
   * @param {{
   *     id: number;
   *     text: string;
   *   }} content - The content to be posted.
   */
  postContent(content) {
    this.state.posts.push(content);
    console.log(`Posted content: ${JSON.stringify(content)}`);
  }

  /**
   * Deletes content from the session state based on the content ID.
   * @param {number} contentId - The ID of the content to be deleted.
   * @returns {{
   *     id: number;
   *     text: string;
   *   }|null} - The deleted content, or null if not found.
   */
  deleteContent(contentId) {
    const postIndex = this.state.posts.findIndex(
      (post) => post.id === contentId
    );
    if (postIndex !== -1) {
      const deletedPost = this.state.posts.splice(postIndex, 1)[0];
      console.log(`Deleted content with id: ${contentId}`);
      return deletedPost;
    } else {
      console.log(`Post with id ${contentId} not found for deletion.`);
      return null;
    }
  }

  /**
   * Renders a post based on its ID.
   * @param {number} postId - The ID of the post to render.
   */
  renderPost(postId) {
    const post = this.state.posts.find((post) => post.id === postId);
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
      console.log("No actions to undo.");
      return;
    }

    switch (lastAction.type) {
      case "edit":
        this.state = lastAction.previousState;
        break;
      case "post":
        this.deleteContent(lastAction.content.id);
        break;
      case "delete":
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
      console.log("No actions to redo.");
      return;
    }

    this.performAction(lastUndoneAction);

    this.undoStack.pop();

    console.log(`Redone action: ${lastUndoneAction.description}`);
  }

  /**
   * Simulates visiting a page and adds it to the history.
   * @param {{
   *  url: string;
   *  content: {
   *     url: string;
   *     text: string;
   *   }} page - The page to visit.
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
   * @param {{
   *     title: string,
   *     text: string
   *   }} content - The content to render.
   */
  renderPageContent(content) {
    console.log(`Rendering page content: ${JSON.stringify(content, null, 2)}`);
  }
}
