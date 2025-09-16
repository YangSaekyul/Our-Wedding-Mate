import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 p-8 card">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-primary-600 mb-2">
                        Our Wedding Mate
                    </h1>
                    <p className="text-secondary-600 mb-8">
                        예비 신혼부부를 위한 프라이빗 협업 플래닝 툴
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/login"
                        className="w-full btn-primary block text-center"
                    >
                        로그인
                    </Link>

                    <Link
                        href="/signup"
                        className="w-full btn-secondary block text-center"
                    >
                        회원가입
                    </Link>
                </div>

                <div className="text-center text-sm text-secondary-500">
                    <p>아직 계정이 없으신가요?</p>
                    <p>회원가입 후 커플과 함께 웨딩 준비를 시작하세요!</p>
                </div>
            </div>
        </div>
    )
}
