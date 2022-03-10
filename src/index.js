var TaskRunner = require('./TaskRunner');

var runner = new TaskRunner((priority) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(priority)
        }, 5000)
    })
}, {
    concurrentExecuteTaskMax: 5,
    timeout: 500,
});

runner.postTask({
    event: 'timeout',
}, 100, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 100, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 100, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 110, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 107, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 100, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 200, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 100, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 400, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 100, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 170, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 100, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 100, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 275, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 100, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 100, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 100, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 100, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 100, (priority) => {
    console.log(priority);
})
runner.postTask({
    event: 'timeout',
}, 170, (priority) => {
    console.log(priority);
})
