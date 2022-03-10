const PriorityQueue = require("./PriorityQueue");

class TaskRunner {
    constructor(promiseHandle, {
        concurrentExecuteTaskMax,
        timeout
    }) {
        this.queue = new PriorityQueue((a, b) => {
            return a.priority - b.priority;
        });

        this.promiseHandle = promiseHandle;
        this.MAX_TASK_NUM = concurrentExecuteTaskMax;
        this.timeout = timeout;

        this.processingTask = [];
        this.isProcessing = 0;
        this.historyWorkerCount = 0;
    }

    waitForTimeout(worker) {
        return new Promise((resolve, reject) => {
            worker.timeoutId = setTimeout(() => {
                reject()
            }, this.timeout || Infinity)
        })
    }

    check() {
        while (this.isProcessing < this.MAX_TASK_NUM && this.queue.size()) {
            const worker = this.queue.deq();
            const {id: runningId, task, onResolve, onReject, priority} = worker;
            this.isProcessing++;
            this.processingTask.push(worker);
            const taskPromise = this.promiseHandle({
                task,
                priority
            });
            Promise.race([taskPromise, this.waitForTimeout(worker)])
                .then((res) => {
                    onResolve && onResolve(res)
                })
                .catch((res) => {
                    onReject && onReject(res)
                })
                .finally(() => {
                    clearTimeout(worker.timeoutId);
                    this.isProcessing--;
                    this.processingTask = this.processingTask.filter(({id}) => id !== runningId);
                    this.check();
                })
        }
    }

    postTask(task, onResolve, onReject, priority) {
        if (!priority) {
            throw 'priority not set';
        }
        this.queue.enq({
            task,
            priority,
            id: this.historyWorkerCount++,
            onResolve,
            onReject,
        });
        this.check();
    }
}

module.exports = TaskRunner
