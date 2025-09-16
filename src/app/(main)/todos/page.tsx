'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'
import { Todo, CreateTodoData } from '@/types'

export default function TodosPage() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [newTodo, setNewTodo] = useState('')
    const { token } = useAuthStore()

    useEffect(() => {
        if (token) {
            fetchTodos()
        } else {
            setError('로그인이 필요합니다.')
            setIsLoading(false)
        }
    }, [token])

    const fetchTodos = async () => {
        try {
            const response = await fetch('/api/todos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || '할 일을 불러오는데 실패했습니다.')
            }

            setTodos(data.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTodo.trim()) return

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newTodo })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || '할 일 추가에 실패했습니다.')
            }

            setNewTodo('')
            fetchTodos() // 목록 새로고침
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
        }
    }

    const handleToggleTodo = async (id: string, isCompleted: boolean) => {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isCompleted: !isCompleted })
            })

            if (!response.ok) {
                throw new Error('할 일 수정에 실패했습니다.')
            }

            fetchTodos() // 목록 새로고침
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-2 text-secondary-600">로딩 중...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div>
                <h1 className="text-3xl font-bold text-secondary-900">할 일 관리</h1>
                <p className="text-secondary-600 mt-1">
                    웨딩 준비 체크리스트를 관리하세요
                </p>
            </div>

            {/* 새 할 일 추가 */}
            <div className="card">
                <form onSubmit={handleAddTodo} className="flex gap-4">
                    <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="새 할 일을 입력하세요"
                        className="input-field flex-1"
                    />
                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        추가
                    </button>
                </form>
            </div>

            {/* 할 일 목록 */}
            <div className="card">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                    할 일 목록
                </h2>
                {todos.length > 0 ? (
                    <div className="space-y-3">
                        {todos.map((todo) => (
                            <div key={todo.id} className="flex items-center space-x-3 p-3 border border-secondary-200 rounded-lg">
                                <input
                                    type="checkbox"
                                    checked={todo.isCompleted}
                                    onChange={() => handleToggleTodo(todo.id, todo.isCompleted)}
                                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                />
                                <span className={`flex-1 ${todo.isCompleted ? 'line-through text-secondary-500' : 'text-secondary-900'}`}>
                                    {todo.content}
                                </span>
                                {todo.dueDate && (
                                    <span className="text-sm text-secondary-500">
                                        {new Date(todo.dueDate).toLocaleDateString('ko-KR')}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-secondary-500 text-center py-8">
                        등록된 할 일이 없습니다. 새 할 일을 추가해보세요!
                    </p>
                )}
            </div>
        </div>
    )
}
