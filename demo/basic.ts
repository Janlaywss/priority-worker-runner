import TaskRunner from '../build';

interface Task {
    event: 'timeout' | 'fetch',
    payload?: any
}

type TimeRef = {value: number | undefined};

const timeoutTask = (timeRef: TimeRef) => {
    return new Promise((resolve) => {
        // @ts-ignore
        timeRef.value = setTimeout(() => {
            resolve('hello world')
        }, 1000);
    })
}

const runner = new TaskRunner<Task>(({task}) => {
    let timeRef: TimeRef = {value: undefined};
    const cleanup = () => {
        clearTimeout(timeRef.value);
    }
    const handle = async () => {
        const event = task.event;
        if (event === 'timeout') {
            return await timeoutTask(timeRef);
        }
    }
    return {handle, cleanup}
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
