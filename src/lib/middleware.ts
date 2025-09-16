import { NextRequest } from 'next/server'
import { verifyToken, extractTokenFromHeader } from './auth'

export interface AuthenticatedRequest extends NextRequest {
    user?: {
        userId: string
        email: string
        coupleId?: string
    }
}

/**
 * API 요청에서 사용자 인증 정보를 추출하고 검증합니다
 * @param request NextRequest 객체
 * @returns 인증된 사용자 정보 또는 null
 */
export function authenticateRequest(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)

    if (!token) {
        return null
    }

    const payload = verifyToken(token)
    return payload
}

/**
 * API 라우트에서 인증이 필요한 경우 사용하는 헬퍼 함수
 * @param request NextRequest 객체
 * @returns 인증된 사용자 정보
 * @throws 인증 실패 시 에러
 */
export function requireAuth(request: NextRequest) {
    const user = authenticateRequest(request)

    if (!user) {
        throw new Error('인증이 필요합니다.')
    }

    return user
}
