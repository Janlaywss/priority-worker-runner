# priority-worker-runner

Priority queue based task execution queue.

> PriorityQueue based on: https://github.com/janogonzalez/priorityqueuejs

## Features

- [x] Async task
- [x] Task timeout terminate
- [x] Custom task generator
- [x] Task execute at priority 
- [x] Custom Max Concurrent Execute Task

## How to use

### Install

```shell
yarn add priority-worker-runner --save;
```

### Import module

```typescript
import TaskRunner from 'priority-worker-runner';
```

### Create TaskRunner Instance
```typescript
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
    const {event} = task;
    if (event === 'timeout') {
        return await timeoutTask();
    }
}, {
    concurrentExecuteTaskMax: 5,
});
```

#### Post new task
```typescript

runner.postTask({
    event: 'timeout',
}, {
    priority: 100,
    onResolve: (result) => {
        console.log(result);
    },
})

runner.postTask({
    event: 'timeout',
}, {
    priority: 100,
    onResolve: (result) => {
        console.log(result);
    },
})
```

## API

### new TaskRunner(promiseHandle, props)

- `promiseHandle`: Task generator function. return `Promise`
- `props`
  - concurrentExecuteTaskMax: `number`. Wait if the task being executed is greater than the maximum concurrency.
  - timeout?: `number`

### TaskRunner#postTask(task, options)

- `task`: Your custom task. Task will be converted to `promise` through `promiseHandle` function.
- `options`
  - onResolve?: `Function`. Callback function after successful task execution
  - onReject?: `Function`. Callback function after failed task execution
  - priority: `number`. Task priority, The higher the number, the priority scheduling
