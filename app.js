'use strict';


const form = document.querySelector('.create-task-form');
const clearBtn = document.querySelector('.clear-tasks');
const taskInput = document.querySelector('.task-input');
const filter = document.querySelector('.filter-input');
const taskList = document.querySelector('.collection');


document.addEventListener('DOMContentLoaded', showPosts);
form.addEventListener('submit', addTask);
taskList.addEventListener('click', deleteTask);
clearBtn.addEventListener('click', removeAllTasks);
filter.addEventListener('keyup', filterTasks);


function showPosts() {
    let tasks;
    //добавив змiнну до локал сторедж щоб нумерувати таски
    localStorage.setItem('tasksNum', 0);
    let taskNum = Number(localStorage.getItem('tasksNum'));

    if (localStorage.getItem('tasks') !== null) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    } else {
        tasks = [];
    }

    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.classList.add('task');
        li.setAttribute('data-num', taskNum);
        li.innerHTML = task;

        //створюю бокс для кнопок
        const wrapper = document.createElement('div');
        wrapper.classList.add('button-wrapper');
        wrapper.innerHTML = '';
        li.append(wrapper);

        const button = document.createElement('button');
        button.classList.add('remove-task');
        button.innerHTML = '';
        wrapper.append(button);

        //створюю бокс для редагування
        const editTask = document.createElement('i');
        editTask.classList.add('edit-task');
        editTask.innerHTML = '';
        wrapper.append(editTask);
        
        taskList.append(li);
        //збiльшую змiнну на кожному кроцi
        taskNum++;
    })
    //зберiгаю змiнну
    localStorage.setItem('tasksNum', taskNum);
}

function addTask(event) {
    event.preventDefault();
    const value = taskInput.value;

    if (value.trim() === '') {
        return null;
    }

    const li = document.createElement('li');
    li.classList.add('task');

    //для нових таскiв зчитую даннi лiчильника
    let taskNum = Number(localStorage.getItem('tasksNum'));
    li.setAttribute('data-num', taskNum++);
    localStorage.setItem('tasksNum', taskNum)
    
    li.innerHTML = value;

    const wrapper = document.createElement('div');
    wrapper.classList.add('button-wrapper');
    wrapper.innerHTML = '';
    li.append(wrapper);

    const button = document.createElement('button');
    button.classList.add('remove-task');
    button.innerHTML = '';
    wrapper.append(button);

    //створюю бокс для редагування
    const editTask = document.createElement('i');
    editTask.classList.add('edit-task');
    editTask.innerHTML = '';
    wrapper.append(editTask);
    
    taskList.append(li);

    storeTasksInLocalStorage(value);
    taskInput.value = '';
}

function storeTasksInLocalStorage(task) {
    let tasks;

    if (localStorage.getItem('tasks') !== null) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    } else {
        tasks = []
    }
    tasks.push(task);
    
    localStorage.setItem('tasks', JSON.stringify(tasks));

}

function deleteTask(event) {
    if (event.target.classList.contains('remove-task')) {
        if(confirm('Ви впевнені що хочете видалити цей елемент?')) {
            event.target.parentElement.parentElement.remove();
            removeTaskFromLocalStorage(event.target.parentElement.parentElement);
        }
    }

    //виклик редагування
    if (event.target.classList.contains('edit-task')) {
        editTask(event.target.parentElement.parentElement);
    }
}

// функцiя редагування
function editTask(taskElement) {
    taskElement.firstChild.textContent = prompt('Введiть новий текст', taskElement.firstChild.textContent) || taskElement.firstChild.textContent;
    
    let tasks;
    if (localStorage.getItem('tasks') !== null) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    } else {
        tasks = [];
    }
    tasks.splice(+taskElement.dataset.num, 1, taskElement.firstChild.textContent)
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskElement) {
    let tasks;
    if (localStorage.getItem('tasks') !== null) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    } else {
        tasks = [];
    }

    tasks.splice(+taskElement.dataset.num, 1);
    const filteredTasks = tasks;

    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    taskList.innerHTML = '';
    showPosts();
}

function removeAllTasks() {
    if(confirm('Ви впевнені що хочете видалити всі елементи?')) {
        taskList.innerHTML = '';
        removeAllTaskFromLocalStorage();
    }
}

function removeAllTaskFromLocalStorage() {
    localStorage.clear()
}

function filterTasks(event) {
    const itemList = document.querySelectorAll('.task');
    const searchQuery = event.target.value.toLowerCase();

    itemList.forEach((item) => {
        const itemValue = item.firstChild.textContent.toLowerCase();
        
        if (itemValue.includes(searchQuery)) {
            item.classList.add('list-item');
            item.classList.remove('list-none');
        } else {
            item.classList.remove('list-item');
            item.classList.add('list-none')
        }
    })
}
