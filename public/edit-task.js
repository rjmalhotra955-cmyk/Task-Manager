const taskIDDOM = document.querySelector('.task-edit-id')
const taskNameDOM = document.querySelector('.task-edit-name')
const taskPriorityDOM = document.querySelector('.task-edit-priority')
const taskCategoryDOM = document.querySelector('.task-edit-category')
const taskDueDOM = document.querySelector('.task-edit-due')
const taskCompletedDOM = document.querySelector('.task-edit-completed')
const editFormDOM = document.querySelector('.single-task-form')
const editBtnDOM = document.querySelector('.task-edit-btn')
const formAlertDOM = document.querySelector('.form-alert')
const params = window.location.search
const id = new URLSearchParams(params).get('id')
let tempName

// puts a task's values into the form fields
const fillForm = (task) => {
  const { _id: taskID, completed, name, priority, category, dueDate } = task

  taskIDDOM.textContent = taskID
  taskNameDOM.value = name
  taskPriorityDOM.value = priority || 'medium'
  taskCategoryDOM.value = category || ''
  // date input needs YYYY-MM-DD
  taskDueDOM.value = dueDate ? dueDate.slice(0, 10) : ''
  taskCompletedDOM.checked = !!completed
  tempName = name
}

const showTask = async () => {
  try {
    const {
      data: { task },
    } = await axios.get(`/api/v1/tasks/${id}`)
    fillForm(task)
  } catch (error) {
    console.log(error)
  }
}

showTask()

editFormDOM.addEventListener('submit', async (e) => {
  editBtnDOM.textContent = 'Loading...'
  e.preventDefault()
  try {
    const {
      data: { task },
    } = await axios.patch(`/api/v1/tasks/${id}`, {
      name: taskNameDOM.value,
      completed: taskCompletedDOM.checked,
      priority: taskPriorityDOM.value,
      category: taskCategoryDOM.value.trim() || 'general',
      dueDate: taskDueDOM.value || null,
    })

    fillForm(task)
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, edited task`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    console.error(error)
    taskNameDOM.value = tempName
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent =
      (error.response && error.response.data.msg) || 'error, please try again'
  }
  editBtnDOM.textContent = 'Edit'
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})