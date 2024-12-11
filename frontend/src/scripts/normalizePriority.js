function normalizePriority (priorityValue) {
    if (priorityValue == 1) {
        return '!'
    } else if (priorityValue == 2) {
        return '!!'
    } else {
        return '!!!'
    }
}

export {normalizePriority};
