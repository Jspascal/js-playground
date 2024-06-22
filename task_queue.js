/**
 * Represents a queue of tasks with controlled concurrency.
 */
class TaskQueue {
    /**
     * Creates an instance of TaskQueue.
     * @param {number} concurrency - The number of tasks to run concurrently.
     */
    constructor(concurrency) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }

    /**
     * Runs a task with an optional priority.
     * @param {Function} task - The task function to run.
     * @param {number} [priority=0] - The priority of the task.
     * @returns {Promise} - A promise that resolves when the task is completed.
     */
    runTask(task, priority = 0) {
        return new Promise((resolve, reject) => {
            // Insert task based on priority
            const taskEntry = { task: () => task().then(resolve, reject), priority };
            const index = this.queue.findIndex(t => t.priority < priority);
            if (index !== -1) {
                this.queue.splice(index, 0, taskEntry);
            } else {
                this.queue.push(taskEntry);
            }
            process.nextTick(this.next.bind(this));
        });
    }

    /**
     * Processes the next task in the queue if concurrency allows.
     */
    next() {
        if (this.running < this.concurrency && this.queue.length) {
            const entry = this.queue.shift();
            this.running++;
            entry.task().finally(() => {
                this.running--;
                this.next();
            });
        }
    }
}

/**
 * Simulates payment validation for an order.
 * @param {string} orderId - The ID of the order.
 * @returns {Promise} - A promise that resolves with a validation message.
 */
const validatePayment = (orderId) => {
    console.log(`Validating payment for order ${orderId}`);
    return new Promise(resolve => setTimeout(resolve, 5000, `Payment validated for order ${orderId}`));
};

/**
 * Simulates inventory update for a product.
 * @param {string} productId - The ID of the product.
 * @returns {Promise} - A promise that resolves with an update message.
 */
const updateInventory = (productId) => {
    console.log(`Updating inventory for product ${productId}`);
    return Promise.resolve(`Inventory updated for product ${productId}`);
};

/**
 * Simulates sending a confirmation email.
 * @param {string} email - The email address to send to.
 * @returns {Promise} - A promise that resolves with a confirmation message.
 */
const sendConfirmationEmail = (email) => {
    console.log(`Sending confirmation email to ${email}`);
    return Promise.resolve(`Confirmation email sent to ${email}`);
};

// Create a queue with a concurrency of 2
const orderProcessingQueue = new TaskQueue(2);

// Process orders
orderProcessingQueue.runTask(() => validatePayment('123'), 1)
    .then(console.log)
    .catch(console.error);

orderProcessingQueue.runTask(() => updateInventory('A1'))
    .then(console.log)
    .catch(console.error);

orderProcessingQueue.runTask(() => sendConfirmationEmail('customer@example.com'))
    .then(console.log)
    .catch(console.error);

orderProcessingQueue.runTask(() => validatePayment('124'), 1)
    .then(console.log)
    .catch(console.error);