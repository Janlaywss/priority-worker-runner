import TaskRunner from '../build';

interface Task {
    event: 'timeout' | 'fetch',
    payload?: any
}

const timeoutTask = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('hello world')
        }, 10);
    })
}

const runner = new TaskRunner<Task>(async ({task}) => {
    const event = task.event;
    if (event === 'timeout') {
        return await timeoutTask();
    }
}, {
    concurrentExecuteTaskMax: 5,
    timeout: 5,
});

runner.postTask({
    event: 'timeout',
}, {
    priority: 100,
    onResolve: (result) => {
        console.log(result);
    },
    onReject: (errorReason) => {
        console.error(errorReason);
    },
})

runner.postTask({
    event: 'timeout',
}, {
    priority: 100,
    onResolve: (result) => {
        console.log(result);
    },
    onReject: (errorReason) => {
        console.error(errorReason);
    },
})
