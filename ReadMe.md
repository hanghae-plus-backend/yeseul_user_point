## 디렉토리 구조
src
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── database
│   ├── database.module.ts
│   ├── pointhistory.table.ts
│   └── userpoint.table.ts
├── main.ts
└── point
    ├── point.controller.ts
    ├── point.dto.ts
    ├── point.model.ts
    └── point.module.ts


## 엔티티와 모듈 구성
엔티티:  데이터베이스의 테이블과 매핑되는 클래스 PointHistoryTable과 UserPointTable이 여기에 해당
모듈: 애플리케이션의 구성 요소를 나누고 의존성을 관리하는 핵심 구성요소 database.module, point.module

## 의존성 주입
객체가 필요로 하는 외부의 객체나 서비스를 직접 생성하지 않고 외부로부터 받아 사용하는 디자인 패턴, 객체간의 결합도를 낮춤, 코드재사용성업, 테스트 용이


## 추가구현
- 포인트 충전,이용 내역을 조회하는 history 기능을 작성하려면 charge와 use 함수에 history 업데이트가 포함되어야 한다 
- 특정유저의 포인트 충전 하는 기능을 하용하려면 기존 포인트를 db에서 불러온뒤 더해야함. 
- 마찬가지로 포인트 사용하려면 포인트를 db에서 불러온뒤 뺄셈을 한다. 
- 업데이트 된 값은 다시 insertOrUpdate 메서드를 사용해서 db 업데이트 필요
- sumPoint는 음수가 안되도록 로직처리 필요

## 예외처리

## 테스트 함수
