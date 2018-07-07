(function() {
	var filters = {
		all: todos => todos,
		active: todos => todos.filter(todo => !todo.completed),
		completed: todos => todos.filter(todo => todo.completed)
	}

	var visibility = location.hash.substr(location.hash.indexOf('/')+1)
	visibility = visibility === '' ? 'all' : visibility

	var app = new Vue({
		el: '.todoapp',
		data: {
			newTodo: '',
			todos: todoStorage.fetch(),
			editedTodo: null,
			beforeEditCache: '',
			visibility
		},
		computed: {
			showTodos() {
				return this.todos.length > 0
			},
			activeCount() {
				return filters.active(this.todos).length
			},
			completedCount() {
				return filters.completed(this.todos).length
			},
			allDone: {
				get() {
					return this.activeCount === 0
				},
				set(value) {
					this.todos.map(todo => {
						todo.completed = value
					})
				}
			},
			filteredTodos() {
				return filters[this.visibility](this.todos)
			}
		},
		watch: {
			todos: {
				deep: true,
				handler: todoStorage.save
			}
		},
		methods: {
			addTodo() {
				this.newTodo = this.newTodo.trim()
				if (!this.newTodo) {
					return
				}
				this.todos.unshift({
					title: this.newTodo,
					completed: false
				})
				this.newTodo = ''
			},
			removeTodo(todo) {
				var index = this.todos.indexOf(todo)
				this.todos.splice(index, 1)
			},
			editTodo(todo) {
				this.editedTodo = todo
				this.beforeEditCache = todo.title
			},
			doneEdit(todo) {
				if (!this.editedTodo) {
					return
				}
				this.editedTodo = null
				todo.title = todo.title.trim()
				if (!todo.title) {
					this.removeTodo(todo)
				}
			},
			cancelEdit(todo) {
				if (this.editedTodo) {
					todo.title = this.beforeEditCache
					this.editedTodo = null
				}
			},
			removeCompleted() {
				this.todos = filters.active(this.todos)
			}
		},
		directives: {
			focus: {
				update(el) {
					el.focus()
				}
			}
		},
	})
})();