import PriorityQueue from './PriorityQueue';

interface Worker<T> {
    task: T,
    priority: number,
    id: number,
    onResolve: (res) => void,
    onReject: (errorReason) => void,
}

interface TaskRunnerProps {
    concurrentExecuteTaskMax: number;
    timeout?: number;
}

type PromiseHandleType<T> = (worker: Worker<T>) => Promise<any>;

class TaskRunner<T> {
    queue: any;
    promiseHandle: PromiseHandleType<T>;
    MAX_TASK_NUM: any;
    processingTask: Worker<T>[];
    timeout: number;
    isProcessing: number;
    historyWorkerCount: number;

    constructor(promiseHandle: PromiseHandleType<T>, props: TaskRunnerProps) {
        const {concurrentExecuteTaskMax, timeout} = props;
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
            }, this.timeout)
        })
    }

    check() {
        while (this.isProcessing < this.MAX_TASK_NUM && this.queue.size()) {
            const worker = this.queue.deq();
            const {id: runningId, onResolve, onReject} = worker;

            this.isProcessing++;
            this.processingTask.push(worker);

            const taskPromise = this.promiseHandle(worker);

            const onTaskEnd = () => {
                clearTimeout(worker.timeoutId);
                this.isProcessing--;
                this.processingTask = this.processingTask.filter(({id}) => id !== runningId);
                this.check();
            }

            const race = [taskPromise];

            if (this.timeout) {
                race.push(this.waitForTimeout(worker));
            }

            Promise.race(race)
                .then((res) => {
                    onResolve && onResolve(res)
                })
                .catch((res) => {
                    onReject && onReject(res);
                    onTaskEnd();
                })
                .finally(onTaskEnd)
        }
    }

    postTask(task: T, {onResolve, onReject, priority}: {
        onResolve?: Worker<T>['onResolve'];
        onReject?: Worker<T>['onReject'];
        priority: Worker<T>['priority'];
    }) {
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

export default TaskRunner;
