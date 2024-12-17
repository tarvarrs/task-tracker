export const handleSearch = (searchTaskId) => {
    if (!searchTaskId) {
        setSearchResult(null);
        return;
    }
    fetch(`http://localhost:4000/tasks/${searchTaskId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Task not found');
            }
            return response.json();
        })
        .then((task) => {
            setSearchResult(task);
        })
        .catch((error) => {
            console.warn(error.message);
            alert('Задача с указанным ID не найдена');
            setSearchResult(null);
        });
    }

export const handleSortTasks = (sortOption, setTasks) => {
    let sortParam = '';
    switch (sortOption) {
        case 'ID':
            sortParam = 'id';
            break;
        case 'дате':
            sortParam = 'deadline';
            break;
        case 'статусу':
            sortParam = 'status';
            break;
        case 'приоритету':
            sortParam = 'priority';
            break;
        default:
            sortParam = 'id';
        }
    fetch(`http://localhost:4000/tasks/ordered_by_${sortParam}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch sorted tasks');
            }
            return response.json();
        })
        .then((sortedTasks) => {
            setTasks(sortedTasks);
        })
        .catch((error) => {
            console.error('Error fetching sorted tasks:', error);
            alert('Не удалось загрузить отсорированные задачи');
        });
    };

export const handleFilterTasks = (filterOption) => {
    let filterParam = '';
    switch (filterOption) {
        case 'Все':
            filterParam = 'all';
            break;
        case 'В ожидании':
            filterParam = 'pending';
            break;
        case 'В процессе':
            filterParam = 'process';
            break;
        case 'Выполнено':
            filterParam = 'done';
            break;
        default:
            filterParam = 'all';
        }
        fetch(`http://localhost:4000/tasks/filtered_${filterParam}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch filtered tasks');
                }
                return response.json();
            })
            .then((filteredTasks) => {
                setTasks(filteredTasks);
            })
            .catch((error) => {
                console.error('Error fetching filtered tasks', error);
                alert('Не удалось загрузить задачи по фильтру');
            });
        };

export const handleStatusChange = (taskId, newStatus, setTasks) => {
fetch(`http://localhost:4000/tasks/${taskId}/status`, {
    method: 'PUT',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: newStatus }),
})
    .then((response) => {
    if (!response.ok) {
        throw new Error('Failed to update task status');
    }
    return response.json();
    })
    .then((data) => {
    console.log(data.message);
    setTasks((prevTasks) =>
        prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus, date_update: new Date().toISOString().slice(0, 10) } : task
    ));
    })
    .catch((error) => {
    console.log('Error updating task status:', error);
    alert('Не удалось обновить статус задачи');
    });
};

export const handleDeleteTask = (taskId, setTasks) => {
if (!window.confirm('Вы точно хотите удалить эту задачу? Это действие безвозвратно')) {
    return;
}
fetch(`http://localhost:4000/tasks/${taskId}`, {
    method: 'DELETE',
})
    .then((response) => {
    if (!response.ok) {
        throw new Error('Failed to delete task');
    }
    return response.json();
    })
    .then((data) => {
    console.log(data.message);
    setTasks((prevTask) => prevTask.filter((task) => task.id !== taskId));
    })
    .catch((error) => {
    console.error('Error deleting task:', error);
    alert('Не удалось удалить задачу');
    });
}
