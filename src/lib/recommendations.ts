// 카테고리별 추천 아이템 데이터
export const recommendedItems = {
    '에어컨': [
        { name: '삼성 무풍 에어컨', price: 1200000, url: 'https://example.com/samsung-ac' },
        { name: 'LG 휘센 인버터', price: 980000, url: 'https://example.com/lg-ac' },
        { name: '캐리어 벽걸이 에어컨', price: 750000, url: 'https://example.com/carrier-ac' }
    ],
    '냉장고': [
        { name: 'LG 디오스 냉장고', price: 1800000, url: 'https://example.com/lg-fridge' },
        { name: '삼성 비스포크 냉장고', price: 2200000, url: 'https://example.com/samsung-fridge' },
        { name: '위니아 냉장고', price: 650000, url: 'https://example.com/winia-fridge' }
    ],
    '세탁기': [
        { name: 'LG 트롬 세탁기', price: 1100000, url: 'https://example.com/lg-washer' },
        { name: '삼성 버블샷 세탁기', price: 950000, url: 'https://example.com/samsung-washer' },
        { name: '대우 세탁기', price: 450000, url: 'https://example.com/daewoo-washer' }
    ],
    'TV': [
        { name: '삼성 QLED TV', price: 2500000, url: 'https://example.com/samsung-tv' },
        { name: 'LG OLED TV', price: 3200000, url: 'https://example.com/lg-tv' },
        { name: '소니 4K TV', price: 1800000, url: 'https://example.com/sony-tv' }
    ],
    '침대': [
        { name: '시몬스 매트리스', price: 800000, url: 'https://example.com/simmons-bed' },
        { name: '라지스 침대', price: 1200000, url: 'https://example.com/ragis-bed' },
        { name: '이케아 침대', price: 300000, url: 'https://example.com/ikea-bed' }
    ],
    '소파': [
        { name: '한샘 소파', price: 1500000, url: 'https://example.com/hanssem-sofa' },
        { name: '이케아 소파', price: 500000, url: 'https://example.com/ikea-sofa' },
        { name: '현대리바트 소파', price: 2000000, url: 'https://example.com/hyundai-sofa' }
    ]
}

export function getRecommendations(category: string) {
    return recommendedItems[category as keyof typeof recommendedItems] || []
}

export function getAllCategories() {
    return Object.keys(recommendedItems)
}
