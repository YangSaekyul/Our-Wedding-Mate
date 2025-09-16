import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'
import { UpdateTodoData } from '@/types'

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = requireAuth(request)
        const { id } = await params

        if (!user.coupleId) {
            return NextResponse.json(
                { error: '커플 정보가 필요합니다.' },
                { status: 400 }
            )
        }

        const body: UpdateTodoData = await request.json()
        const { content, dueDate, isCompleted } = body

        // TODO 존재 여부 및 권한 확인
        const existingTodo = await prisma.todo.findFirst({
            where: {
                id,
                coupleId: user.coupleId
            }
        })

        if (!existingTodo) {
            return NextResponse.json(
                { error: '할 일을 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        const updateData: any = {}
        if (content !== undefined) updateData.content = content
        if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null
        if (isCompleted !== undefined) updateData.isCompleted = isCompleted

        const todo = await prisma.todo.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json({
            success: true,
            data: todo,
            message: '할 일이 수정되었습니다.'
        })

    } catch (error) {
        console.error('Update todo error:', error)

        if (error instanceof Error && error.message === '인증이 필요합니다.') {
            return NextResponse.json(
                { error: '인증이 필요합니다.' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = requireAuth(request)
        const { id } = await params

        if (!user.coupleId) {
            return NextResponse.json(
                { error: '커플 정보가 필요합니다.' },
                { status: 400 }
            )
        }

        // TODO 존재 여부 및 권한 확인
        const existingTodo = await prisma.todo.findFirst({
            where: {
                id,
                coupleId: user.coupleId
            }
        })

        if (!existingTodo) {
            return NextResponse.json(
                { error: '할 일을 찾을 수 없습니다.' },
                { status: 404 }
            )
        }

        await prisma.todo.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: '할 일이 삭제되었습니다.'
        })

    } catch (error) {
        console.error('Delete todo error:', error)

        if (error instanceof Error && error.message === '인증이 필요합니다.') {
            return NextResponse.json(
                { error: '인증이 필요합니다.' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        )
    }
}
