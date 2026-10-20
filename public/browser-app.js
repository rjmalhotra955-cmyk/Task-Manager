const tasksDOM = document.querySelector('.tasks')
const loadingDOM = document.querySelector('.loading-text')
const formDOM = document.querySelector('.task-form')
const taskInputDOM = document.querySelector('.task-input')
const priorityDOM = document.querySelector('.priority-input')
const categoryDOM = document.querySelector('.category-input')
const dueDOM = document.querySelector('.due-input')
const formAlertDOM = document.querySelector('.form-alert')

// user bar
document.getElementById('user-name').textContent = localStorage.getItem('name') || ''
document.getElementById('logout-btn').addEventListener('click', logout)

// stops task names from being treated as HTML
const escapeHTML = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]))

// Load tasks from /api/v1/tasks
const showTasks = async () => {
  loadingDOM.style.visibility = 'visible'
  try {
    const {
      data: { tasks },
    } = await axios.get('/api/v1/tasks')
    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>'
      loadingDOM.style.visibility = 'hidden'
      return
    }
    const allTasks = tasks
      .map((task) => {
        const { completed, _id: taskID, name, priority, category, dueDate } = task
        const due = dueDate
          ? new Date(dueDate).toLocaleDateString('en-GB', { timeZone: 'UTC' })
          : 'no due date'
        return `<div class="single-task ${completed ? 'task-completed' : ''}">
<h5><span><i class="far fa-check-circle"></i></span>${escapeHTML(name)}
  <small class="task-meta">
    <span class="badge priority-${priority}">${priority}</span>
    <span class="badge">${escapeHTML(category)}</span>
    <span class="badge">${due}</span>
  </small>
</h5>
<div class="task-links">
<!-- edit link -->
<a href="task.html?id=${taskID}" class="edit-link">
<i class="fas fa-edit"></i>
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${taskID}">
<i class="fas fa-trash"></i>
</button>
</div>
</div>`
      })
      .join('')
    tasksDOM.innerHTML = allTasks
  } catch (error) {
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
  loadingDOM.style.visibility = 'hidden'
}

showTasks()

// delete task /api/v1/tasks/:id
tasksDOM.addEventListener('click', async (e) => {
  const el = e.target
  if (el.parentElement.classList.contains('delete-btn')) {
    loadingDOM.style.visibility = 'visible'
    const id = el.parentElement.dataset.id
    try {
      await axios.delete(`/api/v1/tasks/${id}`)
      showTasks()
    } catch (error) {
      console.log(error)
    }
  }
  loadingDOM.style.visibility = 'hidden'
})

// form
formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const name = taskInputDOM.value
  const body = { name, priority: priorityDOM.value }
  if (categoryDOM.value.trim()) body.category = categoryDOM.value.trim()
  if (dueDOM.value) body.dueDate = dueDOM.value

  try {
    await axios.post('/api/v1/tasks', body)
    showTasks()
    taskInputDOM.value = ''
    categoryDOM.value = ''
    dueDOM.value = ''
    priorityDOM.value = 'medium'
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, task added`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent =
      (error.response && error.response.data.msg) || 'error, please try again'
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})