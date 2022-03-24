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
```

### Post new task
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

- `promiseHandle`: 
  - handle: Task generator function. return `Promise`
  - cleanup: `function` clean running effect
- `props`
  - `concurrentExecuteTaskMax`: `number`. Wait if the task being executed is greater than the maximum concurrency.
  - `timeout?`: `number`

### TaskRunner#postTask(task, options)

- `task`: Your custom task. Task will be converted to `promise` through `promiseHandle` function.
- `options`
  - `onResolve?`: `Function`. Callback function after successful task execution
  - `onReject?`: `Function`. Callback function after failed task execution
  - `priority`: `number`. Task priority, The higher the number, the priority scheduling
