'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    partner_name: '',
    wedding_date: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { user } = useStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchProfileData();
  }, [user, router]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/users/profile');
      if (!response.ok) throw new Error('Failed to fetch profile data');
      
      const data = await response.json();
      setProfileData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      setIsEditing(false);
      // 성공 메시지 표시 로직 추가 가능
    } catch (error) {
      console.error('Error updating profile:', error);
      // 에러 메시지 표시 로직 추가 가능
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">로딩중...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">이메일</label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">이름</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditing}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">파트너 이름</label>
              <input
                type="text"
                value={profileData.partner_name}
                onChange={(e) => setProfileData({ ...profileData, partner_name: e.target.value })}
                disabled={!isEditing}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">결혼 예정일</label>
              <input
                type="date"
                value={profileData.wedding_date}
                onChange={(e) => setProfileData({ ...profileData, wedding_date: e.target.value })}
                disabled={!isEditing}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                수정하기
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfileData(); // 수정 취소 시 원래 데이터로 복원
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  저장
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}