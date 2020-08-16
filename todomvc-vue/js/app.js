(function (window) {

	// 不需要使用 父节点时， bind 和 inserted 任用
	// 但是 聚焦比较特殊，只能应用于 inserted中
	Vue.directive('focus', {
		inserted (el) {
			el.focus();
		}
	});


	// 双击 todo 获得聚焦
	Vue.directive('todo-focus', {
		update (el, binging) {
			if (binging.value) {    // currentEditing === item
				el.focus();
			}
		}
	});

	// const todos = [
	// 	{
	// 		id: 1,
	// 		title: '吃饭',
	// 		completed: true
	// 	},
	// 	{
	// 		id: 2,
	// 		title: 'Taste JavaScript',
	// 		completed: false
	// 	},
	// 	{
	// 		id: 3,
	// 		title: '敲代码',
	// 		completed: false
	// 	}
	// ];

	window.vm = new Vue({
		data: {
			todos: JSON.parse(window.localStorage.getItem('todos') || '[]'),
			currentEditing: null,   // 双击进入 编辑状态 的中间变量
			filterText: 'all'      // 过滤数组数据
		},

		// 计算属性本质是一个方法，但是必须当成属性使用
		// 相比普通方法而言，具有缓存机制，提高性能
		// 	   即数据不改变的情况下，不管调用几次，计算属性方法只会执行一次
		//     不能用于事件处理函数
		computed: {

			// 简写，调用 get() 方法
			// remainingCount () {
			// 	return todos.filter(item => !item.completed).length;
			// }

			// 每一个计算属性都是一个对象，里面拥有两个方法：get() set()
			// 当使用 remainingCount 时，默认调用 get() 方法
			// 当给 remainingCount 重新赋值值，会调用 set() 方法，但是 remainingCount 的值还是不变，只是一种调用机制。

			// 处理 剩余任务数
			remainingCount: {
				get () {
					return this.todos.filter(item => !item.completed).length;
				},
				set () {
					console.log(123);
				}
			},

			// 处理联动状态
			toggleAllState: {
				get () {
					return this.todos.every(ele => ele.completed);
				},
				// checkbox 点击一个， toggleAllState 的值就改变一次，所以就调用一次 set()
				set () {
					// 获取 toggleAllState 的状态值
					// !this.toggleAllState 会调用 set() 方法 获取toggleAllState的值
					let checked = !this.toggleAllState;
					this.todos.forEach(ele => {
						ele.completed = checked;
					});
				}
			},

			// 路由状态 过滤数据
			filterTodos () {
				// 如果是 all  return todos
				//       active  todos.filter(ele => !ele.completed)
				//       completed  todos.filter(ele => ele.completed)
				switch (this.filterText) {
					case 'active':
						return this.todos.filter(ele => !ele.completed);
						break;
					case 'completed':
						return this.todos.filter(ele => ele.completed);
					default:
						return this.todos;
				}

			}

			
		},

		// 监视 todos 的变化，当 todos 变化时，调用以下方法
		// 引用类型只能监视一层，无法监视内部成员子成员的变化
		watch: {
			// 基本数据类型
			// 当 currentEditing的值发生改变时，立刻执行以下函数
			currentEditing () {
				console.log(123);
			},

			// 引用类型只能监视一层，无法监视内部成员子成员的变化引用 数据类型
			// 所以使用以下形式可以解决
			todos: {
				// 当 todos 的值改变，就会调用 handle()
				// oldValue 就是变化之前的值
				// newValue 就是变化之后的值
				handler (oldValue, newValue) {
					// 这里的 this.todos === newValue
					// window.localStorage.setItem('todos', JSON.stringify(this.todos));
					window.localStorage.setItem('todos', JSON.stringify(newValue));

				},
				deep: true   // 深度监视，不论嵌套多少层都监视得到
			}
			

		},

		methods: {

			// 添加 todo
			handleAddTodoClick (e) {
				// 按下回车键，获取文本框的值
				let value = e.target.value.trim();
	
				// 检验数据是否为空
				if (!value.length) {
					return;
				}

				// 往数组添加数据
				let todos = this.todos;
				todos.push({
					// 当数组为空时，id 为 1
					id: todos.length ? todos[todos.length - 1].id + 1 : 1,
					title: value,
					completed: false
				});

				// 清空文本框的值
				e.target.value = '';

			},

			// 处理 下拉框标志 点击时改变所有 todo 状态
			handleToggleAllClick (e) {
				let checked = e.target.checked;

				// 联动改变状态
				this.todos.forEach(element => {
					element.completed = checked;
				});
			},
		
			// 删除 todo
			handleRemoveTodoClick (index, e) {
				// 当事件没有传参时，第一个参数就是 事件源事件 event
				// 当手动传递了参数， 就没有办法获取默认的 event对象，需要手动传参 $event
				// 删除指定的 todo
				this.todos.splice(index, 1);
			},

			// label 双击获得编辑状态
			handleGetEditingDblclick (todo) {
				// 把这个变量等于双击的 todo
				this.currentEditing = todo;
			},

			// 编辑任务，敲回车保存编辑数据
			handleSaveEditKeydown (todo, index, e) {
				// 获取文本框编辑内容
				let target = e.target;
				let value = target.value.trim();

				// 如果数据为空，则直接删除数据
				if (!value.length) {
					return this.todos.splice(index, 1);
				}
				//否则保存编辑内容
				todo.title = value;

				// 删除 editing样式
				this.currentEditing = null;
			},

			// 按下 esc，取消编辑状态，回退原来的数据
			handleCancelEditKeydown () {
				// 清除 editing样式
				this.currentEditing = null;
			},
			
			// 处理 点击 clear-complete 时，删除所有已完成的 todo
			handleClearCompletedClick () {
				// 获取未完成的 todo，返回数组
				let newTodos = this.todos.filter(ele => !ele.completed);
				// 更新 todo
				this.todos = newTodos;

				// console.log(todos.filter(item => !item.completed).length)
			},
			






			// handleGetAllClick () {
			// 	this.todos = this.todos;
			// },

			// handleGetActiveClick () {
			// 	this.todos = todos.filter(element => !element.completed);
			// },

			// handleGetCompletedClick () {
			// 	this.todos = this.todos.filter(element => element.completed).length ? this.todos.filter(element => element.completed) : [{}];
			// }
		}
	}).$mount('#app');

	// 该事件在初始化时不会执行， 只有 当路由change时，才会执行
	// 注册 hash(锚点)改变 事件
	window.onhashchange = handleHashChange;

	// 页面初始化时调用一次，保持路由状态
	handleHashChange();

	function handleHashChange () {
		// 获取路由状态
		let hash = window.location.hash.substr(2);
		// 根据路由，改变 filterText 的值
		vm.filterText = hash;
	}
})(window);
