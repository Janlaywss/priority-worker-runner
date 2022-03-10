import TaskRunner from '../src/TaskRunner';

interface Task {
    event: 'timeout' | 'fetch',
    payload?: any
}

const timeoutTask = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(1221121223123)
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
});

runner.postTask({
    event: 'timeout',
}, {
    priority: 100,
    onResolve: (task) => {
        console.log(task);
    },
})

runner.postTask({
    event: 'timeout',
}, {
    priority: 100,
    onResolve: (task) => {
        console.log(task);
    },
})
