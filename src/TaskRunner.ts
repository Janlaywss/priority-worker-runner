import PriorityQueue from './PriorityQueue';

interface Worker<T> {
    task: T,
    priority: number,
    id: number,
    timeoutId?: number
    onResolve: (res: any) => void,
    onReject: (errorReason: any) => void,
}

interface TaskRunnerProps<T> {
    concurrentExecuteTaskMax: number;
    timeout?: number;
}

type PromiseHandleType<T> = (worker: Worker<T>) => {handle: () => Promise<any>, cleanup?: () => void}

class TaskRunner<T> {
    queue: any;
    promiseHandle: PromiseHandleType<T>;
    MAX_TASK_NUM: any;
    processingTask: Worker<T>[];
    timeout: number | undefined;
    isProcessing: number;
    historyWorkerCount: number;

    constructor(promiseHandle: PromiseHandleType<T>, props: TaskRunnerProps<T>) {
        const {concurrentExecuteTaskMax, timeout} = props;
        this.queue = new PriorityQueue<Worker<T>>((a, b) => {
            return a.priority - b.priority;
        });

        this.promiseHandle = promiseHandle;
        this.MAX_TASK_NUM = concurrentExecuteTaskMax;
        this.timeout = timeout;

        this.processingTask = [];
        this.isProcessing = 0;
        this.historyWorkerCount = 0;
    }

    waitForTimeout(worker: Worker<T>) {
        return new Promise((resolve, reject) => {
            worker.timeoutId = setTimeout(() => {
                reject('task execute timeout')
            }, this.timeout)
        })
    }

    check() {
        while (this.isProcessing < this.MAX_TASK_NUM && this.queue.size()) {
            const worker = this.queue.deq();
            const {id: runningId, onResolve, onReject} = worker;

            this.isProcessing++;
            this.processingTask.push(worker);

            const {handle: taskPromise, cleanup} = this.promiseHandle(worker);

            const onTaskEnd = () => {
                cleanup && cleanup();
                clearTimeout(worker.timeoutId);
                this.isProcessing--;
                this.processingTask = this.processingTask.filter(({id}) => id !== runningId);
                this.check();
            }

            const race = [taskPromise()];

            if (this.timeout) {
                race.push(this.waitForTimeout(worker));
            }

            Promise.race(race)
                .then((res) => {
                    onResolve && onResolve(res)
                })
                .catch((res) => {
                    onReject && onReject(res);
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
