export type InterviewItem = {
  term: string;
  oneliner: string;
  detail: string[];
  tag?: string;
};

export type InterviewSection = {
  id: string;
  title: string;
  color: "yellow" | "red" | "white";
  items: InterviewItem[];
};

export const interviewSections: InterviewSection[] = [
  // ── 메모리 / 타입 시스템 ────────────────────────────────
  {
    id: "memory-type",
    title: "메모리 / 타입 시스템",
    color: "yellow",
    items: [
      {
        term: "값 타입 vs 참조 타입",
        oneliner: "값 타입은 스택, 참조 타입은 힙에 저장",
        detail: [
          "값 타입(struct, int, bool 등): 변수 자체에 데이터 저장. 대입 시 복사됨",
          "참조 타입(class, string, 배열 등): 변수는 힙 주소만 보관. 대입 시 주소 복사",
          "값 타입은 스코프 벗어나면 자동 소멸, 참조 타입은 GC가 회수",
          "struct는 상속 불가, 기본 생성자 강제, 박싱 주의",
        ],
      },
      {
        term: "박싱 (Boxing)",
        oneliner: "값 타입 → object로 변환. 힙에 새 객체 생성 → 느림",
        detail: [
          "int i = 42; object o = i; // 박싱 — 힙에 int 크기 객체 새로 할당 후 복사",
          "ArrayList, Hashtable, object 파라미터에 값 타입 넘길 때 암묵적으로 발생",
          "인터페이스로 struct 접근 시에도 박싱 발생: IComparable x = 42;",
          "힙 할당 + GC 부담 → 루프 내 반복 박싱은 심각한 성능 저하 원인",
          "제네릭(List<int>, Dictionary<K,V>)으로 대체하면 박싱 없음",
          "string.Format(\"{0}\", intVal) → 박싱 발생. $\"{intVal}\" (보간)은 박싱 없음",
          "Equals(object) 호출 시 값 타입이 박싱됨. IEquatable<T> 구현으로 방지",
        ],
      },
      {
        term: "언박싱 (Unboxing)",
        oneliner: "object → 값 타입으로 역변환. 잘못된 타입이면 InvalidCastException",
        detail: [
          "object o = 42; int i = (int)o; // 언박싱 — 힙에서 스택으로 값 복사",
          "박싱된 타입과 정확히 일치해야 함 — (long)o 는 예외 발생 (int로 박싱됐으므로)",
          "is/as로 타입 확인 후 언박싱하면 안전: if (o is int n) { ... }",
          "언박싱도 힙 접근 비용 발생. 박싱/언박싱 쌍이 많으면 반드시 제네릭으로 교체",
          "Nullable<T>(int?) 박싱: null이면 null object, 값 있으면 언박싱 시 T로 꺼냄",
        ],
      },
      {
        term: "스택 vs 힙",
        oneliner: "스택은 빠르고 자동 정리, 힙은 크고 GC가 관리",
        detail: [
          "스택: LIFO 구조. 메서드 호출마다 스택 프레임 생성. 빠르고 자동 소멸",
          "힙: 런타임에 크기 결정. GC가 수거. 단편화 가능",
          "스택 크기 초과 시 StackOverflowException (재귀 무한 호출 등)",
          "큰 struct는 스택 복사 비용이 class 참조보다 클 수 있음",
        ],
      },
      {
        term: "GC (가비지 컬렉터)",
        oneliner: "참조 없는 힙 객체 자동 수거. Stop-the-world 발생",
        detail: [
          "0세대(단명) → 1세대 → 2세대(장수) 순으로 승격",
          "GC.Collect()로 강제 수거 가능하지만 일반적으로 호출 금지",
          "IDisposable + using으로 GC 전에 자원 명시적 해제",
          "대용량 객체(85KB+)는 LOH(Large Object Heap)에 별도 관리",
          "Span<T>, stackalloc으로 스택 할당해 GC 압박 줄이기 가능",
        ],
      },
      {
        term: "강한 참조 vs 약한 참조 (WeakReference)",
        oneliner: "강한 참조는 객체 생존 보장, 약한 참조는 GC 수거를 막지 않음",
        detail: [
          "강한 참조(strong reference): 일반 참조. 참조가 살아있는 동안 객체는 수거되지 않음",
          "약한 참조(WeakReference): GC 루트 체인에 영향 없음. 메모리 압박 시 언제든 수거 가능",
          "캐시 시나리오: 없어도 다시 만들 수 있는 값은 WeakReference로 보관해 메모리 피크 완화",
          "TryGetTarget(out T target) 패턴으로 객체 생존 여부를 매번 확인해야 안전",
          "이벤트 구독 누수 방지: WPF 등의 WeakEvent 패턴으로 publisher가 subscriber 생존을 붙잡지 않게 설계",
          "면접 포인트: '약한 참조는 메모리 절약 기술이지 수명 제어 기술이 아님'을 명확히 설명",
          "GC 루트(스택/정적 필드/레지스터)에서 도달 가능하면 수거 불가, 그 외 객체는 세대별 회수 대상",
          "흔한 실수: WeakReference에서 꺼낸 객체를 null 체크 없이 사용해 간헐적 NRE 발생",
        ],
      },
      {
        term: "struct vs class",
        oneliner: "struct는 값 타입(스택), class는 참조 타입(힙). 작고 불변이면 struct",
        detail: [
          "struct: 상속 불가, 인터페이스 구현 가능, 기본값 = 0/false",
          "class: 상속 가능, null 가능, 참조 비교(==)가 기본",
          "16바이트 이하, 불변, 박싱 없는 경우에 struct가 유리",
          "record struct(C# 10+): 불변 값 타입 + 값 기반 동등성 자동 생성",
        ],
      },
      {
        term: "얕은 복사 vs 깊은 복사",
        oneliner: "얕은 복사는 참조만 복사, 깊은 복사는 내부까지 새로 만듦",
        detail: [
          "얕은 복사: MemberwiseClone(), 배열 Clone() — 내부 참조 객체는 공유됨",
          "깊은 복사: 직접 구현하거나 직렬화/역직렬화 활용",
          "record는 with 표현식으로 불변 복사 쉽게 가능",
        ],
      },
    ],
  },
  // ── OOP ──────────────────────────────────────────────────
  {
    id: "oop",
    title: "OOP 핵심 개념",
    color: "yellow",
    items: [
      {
        term: "캡슐화 (Encapsulation)",
        oneliner: "데이터와 메서드를 묶고 외부 접근을 제한",
        detail: [
          "private 필드 + public 프로퍼티로 접근 제어",
          "내부 구현 숨기고 인터페이스만 노출 → 유지보수 쉬워짐",
          "C#에서는 { get; private set; } 패턴 많이 씀",
        ],
      },
      {
        term: "상속 (Inheritance)",
        oneliner: "부모 클래스의 기능을 자식이 물려받음",
        detail: [
          "C#은 단일 상속만 허용. 다중 상속은 인터페이스로 대체",
          "virtual / override 로 메서드 재정의",
          "sealed로 상속 차단, abstract로 상속 강제",
          "base 키워드로 부모 메서드/생성자 호출",
          "무조건 상속보다 컴포지션(has-a)이 유연한 경우 많음",
        ],
      },
      {
        term: "다형성 (Polymorphism)",
        oneliner: "같은 인터페이스로 다른 동작. virtual/override 또는 인터페이스",
        detail: [
          "런타임 다형성: virtual + override. 실제 타입 기준으로 메서드 호출",
          "컴파일 타임 다형성: 오버로딩 (메서드 시그니처 다름)",
          "인터페이스 다형성: IShape shape = new Circle(); shape.Draw();",
          "new 키워드는 다형성 아님 — 부모 타입으로 보면 부모 메서드 호출됨",
        ],
      },
      {
        term: "추상화 (Abstraction)",
        oneliner: "공통 특성만 뽑아 인터페이스/추상 클래스로 정의",
        detail: [
          "abstract class: 일부 구현 포함 가능. 직접 인스턴스화 불가",
          "interface: 구현 없음(기본 구현 제외). 다중 구현 가능",
          "interface는 계약(contract), abstract class는 공통 기반",
          "C# 8+: interface에 default 메서드 구현 가능",
        ],
      },
      {
        term: "인터페이스 vs 추상 클래스",
        oneliner: "인터페이스는 계약, 추상 클래스는 공통 기반 코드",
        detail: [
          "인터페이스: 다중 구현 가능. 상태(필드) 없음. '할 수 있다' 관계",
          "추상 클래스: 단일 상속. 필드/생성자/구현 메서드 포함 가능. 'is-a' 관계",
          "외부 라이브러리 타입에 기능 추가 → 인터페이스",
          "공통 초기화 로직 공유 → 추상 클래스",
        ],
      },
    ],
  },
  // ── SOLID ────────────────────────────────────────────────
  {
    id: "solid",
    title: "SOLID 원칙",
    color: "red",
    items: [
      {
        term: "S — 단일 책임 원칙 (SRP)",
        oneliner: "클래스는 변경 이유가 하나여야 함",
        detail: [
          "하나의 클래스가 너무 많은 역할 → 변경 시 영향 범위 커짐",
          "UserService가 DB저장 + 이메일 전송 + 로그 다 하면 SRP 위반",
          "역할마다 클래스 분리 → 테스트, 유지보수 쉬워짐",
        ],
      },
      {
        term: "O — 개방-폐쇄 원칙 (OCP)",
        oneliner: "확장에는 열려있고, 수정에는 닫혀있어야 함",
        detail: [
          "기존 코드 수정 없이 새 기능 추가 가능하게 설계",
          "if-else / switch로 타입 분기 → OCP 위반 신호",
          "전략 패턴, 다형성으로 해결: 새 클래스 추가만으로 확장",
        ],
      },
      {
        term: "L — 리스코프 치환 원칙 (LSP)",
        oneliner: "자식 클래스는 부모를 대체해도 프로그램이 올바르게 동작해야 함",
        detail: [
          "Rectangle → Square 상속에서 SetWidth가 높이도 바꾸면 LSP 위반",
          "오버라이드 시 사전조건 강화, 사후조건 약화 금지",
          "위반 시 다운캐스팅 + is/as 남발하게 됨",
        ],
      },
      {
        term: "I — 인터페이스 분리 원칙 (ISP)",
        oneliner: "클라이언트가 사용하지 않는 메서드에 의존하면 안 됨",
        detail: [
          "거대한 인터페이스 하나보다 작은 인터페이스 여러 개가 나음",
          "IWorker에 Work()와 Eat()이 있으면 로봇 클래스가 Eat() 구현 강제됨 → 위반",
          "IWorkable, IFeedable로 분리",
        ],
      },
      {
        term: "D — 의존성 역전 원칙 (DIP)",
        oneliner: "고수준 모듈이 저수준 모듈에 직접 의존하지 말고 추상에 의존",
        detail: [
          "UserService가 SqlRepository를 직접 new하면 → 강결합",
          "IRepository 인터페이스에 의존 → 구현체를 갈아끼울 수 있음",
          "DI(의존성 주입) 컨테이너로 구현체 주입: 생성자 주입이 가장 권장",
          "테스트 시 Mock 객체로 쉽게 대체 가능",
        ],
      },
    ],
  },
  // ── 디자인 패턴 ──────────────────────────────────────────
  {
    id: "design-patterns",
    title: "디자인 패턴",
    color: "yellow",
    items: [
      {
        term: "싱글턴 (Singleton)",
        oneliner: "인스턴스가 전역에 딱 하나. 전역 설정/캐시/로거에 씀",
        detail: [
          "private 생성자 + static Instance 프로퍼티",
          "멀티스레드 안전: Lazy<T> 또는 static 필드 초기화 활용",
          "테스트 어렵고 전역 상태 문제 → 과용 금지. DI로 대체 권장",
        ],
      },
      {
        term: "팩토리 (Factory)",
        oneliner: "객체 생성 로직을 별도 클래스/메서드로 분리",
        detail: [
          "Factory Method: 자식 클래스가 어떤 객체 만들지 결정",
          "Abstract Factory: 연관된 객체 군(패밀리) 생성",
          "new 직접 호출 줄이고 OCP 달성. 생성 조건 복잡할 때 유용",
        ],
      },
      {
        term: "전략 (Strategy)",
        oneliner: "알고리즘을 인터페이스로 분리해 런타임에 교체 가능하게",
        detail: [
          "ISort 인터페이스 → BubbleSort, QuickSort 구현체",
          "컨텍스트 클래스가 전략 인터페이스 참조 → 실행 시점에 주입",
          "if-else 분기 대신 전략 패턴 → OCP 달성",
        ],
      },
      {
        term: "옵저버 (Observer)",
        oneliner: "이벤트 발행자와 구독자를 느슨하게 연결",
        detail: [
          "C#의 event / delegate가 옵저버 패턴 내장 구현",
          "발행자는 구독자가 누구인지 몰라도 됨",
          "IObservable<T> / IObserver<T>로 Rx 패턴 확장 가능",
        ],
      },
      {
        term: "데코레이터 (Decorator)",
        oneliner: "기존 객체를 감싸서 기능 추가. 상속 없이 확장",
        detail: [
          "ILogger → ConsoleLogger → TimestampLogger(ConsoleLogger 감쌈)",
          "상속 대신 컴포지션으로 기능 조합",
          "C# Stream 클래스 계층이 대표적인 데코레이터 사례",
        ],
      },
      {
        term: "리포지터리 (Repository)",
        oneliner: "데이터 접근 로직을 비즈니스 로직에서 분리",
        detail: [
          "IUserRepository 인터페이스 → SqlUserRepo, InMemoryUserRepo 구현",
          "서비스 레이어가 DB를 직접 몰라도 됨 → DIP 달성",
          "테스트 시 InMemory 구현체로 DB 없이 테스트 가능",
        ],
      },
    ],
  },
  // ── 자료구조/알고리즘 ────────────────────────────────────
  {
    id: "ds-algorithm",
    title: "자료구조 / 알고리즘 개념",
    color: "white",
    items: [
      {
        term: "시간복잡도 / 빅오",
        oneliner: "입력 크기에 따른 연산 횟수 증가율. 최악의 경우 기준",
        detail: [
          "O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)",
          "O(log n): 이진 탐색, 힙 삽입/삭제",
          "O(n log n): 병합 정렬, 퀵 정렬 평균",
          "O(n²): 버블/삽입/선택 정렬, 이중 루프",
          "상수, 낮은 차수 항 무시. O(3n²+5n) = O(n²)",
        ],
      },
      {
        term: "DFS (깊이 우선 탐색)",
        oneliner: "한 방향으로 끝까지 탐색 후 백트래킹. 스택 또는 재귀",
        detail: [
          "구현: 재귀 또는 Stack<T> 사용",
          "활용: 경로 탐색, 사이클 감지, 위상 정렬, 연결 요소",
          "공간복잡도: O(depth). 깊은 그래프면 스택 오버플로우 주의",
          "방문 체크 배열 필수. visited[node] = true",
          "백트래킹: DFS + 가지치기. 조합/순열 문제에 활용",
        ],
      },
      {
        term: "BFS (너비 우선 탐색)",
        oneliner: "가까운 노드부터 탐색. 큐 사용. 최단 경로 보장(가중치 동일 시)",
        detail: [
          "구현: Queue<T> 사용",
          "활용: 최단 경로, 레벨별 탐색, 이분 그래프 판별",
          "공간복잡도: O(너비). 넓은 그래프면 메모리 많이 씀",
          "가중치 있는 최단 경로는 다익스트라 사용",
          "방문 체크 enqueue 시점에 해야 중복 방문 없음",
        ],
      },
      {
        term: "다익스트라 (Dijkstra)",
        oneliner: "가중치 있는 그래프 단일 출발 최단 경로. 음수 간선 불가",
        detail: [
          "PriorityQueue<노드, 거리>로 구현. O((V+E) log V)",
          "dist[] 배열 INF로 초기화 → 시작점 0 → 이완(relaxation)",
          "꺼낸 노드의 거리가 dist[node]보다 크면 스킵 (이미 처리된 것)",
          "음수 간선 있으면 벨만-포드 사용",
        ],
      },
      {
        term: "이진 탐색 (Binary Search)",
        oneliner: "정렬된 배열에서 O(log n) 탐색. left/right/mid 포인터",
        detail: [
          "반드시 정렬된 상태여야 함",
          "mid = left + (right - left) / 2  // 오버플로우 방지",
          "lower_bound: 조건 만족하는 첫 위치 → while(left < right) { if(ok) right=mid; else left=mid+1; }",
          "Array.BinarySearch() 반환값이 음수면 not found (~값이 삽입 위치)",
        ],
      },
      {
        term: "정렬 알고리즘",
        oneliner: "퀵소트 평균 O(n log n), 병합정렬 항상 O(n log n), 카운팅 O(n+k)",
        detail: [
          "퀵 정렬: 평균 O(n log n), 최악 O(n²). 피벗 선택이 핵심. 불안정 정렬",
          "병합 정렬: 항상 O(n log n). 안정 정렬. 추가 공간 O(n) 필요",
          "힙 정렬: 항상 O(n log n). 추가 공간 없음. 불안정 정렬",
          "삽입 정렬: 거의 정렬된 경우 O(n). 작은 배열에 유리",
          "카운팅/기수 정렬: O(n+k). 정수/범위 제한 있을 때",
          "C# Array.Sort(): 하이브리드(인트로소트). 실무에서는 그냥 씀",
        ],
      },
      {
        term: "동적 프로그래밍 (DP)",
        oneliner: "중복 부분 문제를 메모이제이션으로 해결. 최적 부분 구조 필수",
        detail: [
          "조건: 최적 부분 구조 + 중복 부분 문제",
          "탑다운(메모이제이션): 재귀 + 딕셔너리/배열 캐시",
          "바텀업(타뷸레이션): 반복문으로 작은 문제부터 채움",
          "대표 문제: LCS, LIS, 배낭 문제, 동전 교환, 피보나치",
          "점화식 세우기가 핵심. dp[i] = dp[i-1] + dp[i-2] 같은 형태",
        ],
      },
      {
        term: "그리디 (Greedy)",
        oneliner: "매 단계 지역 최적 선택 → 전체 최적이 되는 문제에만 적용",
        detail: [
          "증명이 필요: 교환 논증(exchange argument) 또는 귀납법",
          "대표 문제: 회의실 배정, 거스름돈, 허프만 코딩, MST(크루스칼/프림)",
          "DP와 구분: 그리디는 선택을 되돌리지 않음",
        ],
      },
      {
        term: "트리 / 이진 탐색 트리",
        oneliner: "계층 구조. BST는 왼쪽 < 루트 < 오른쪽. 탐색 O(log n) ~ O(n)",
        detail: [
          "완전 이진 트리 높이: O(log n)",
          "BST 탐색/삽입/삭제: 평균 O(log n), 최악(편향) O(n)",
          "균형 BST(AVL, Red-Black): 항상 O(log n) 보장",
          "C#의 SortedSet<T>은 Red-Black Tree 기반",
          "전위(루트→좌→우) / 중위(좌→루트→우) / 후위(좌→우→루트) 순회",
          "중위 순회 결과가 오름차순 = BST 검증",
        ],
      },
      {
        term: "힙 (Heap)",
        oneliner: "최솟값/최댓값 O(1) 접근, 삽입/삭제 O(log n). 우선순위 큐의 내부 구조",
        detail: [
          "최소 힙: 부모 ≤ 자식. 루트가 최솟값",
          "최대 힙: 부모 ≥ 자식. 루트가 최댓값",
          "완전 이진 트리로 배열에 표현. 부모 = (i-1)/2, 왼쪽 = 2i+1, 오른쪽 = 2i+2",
          "C# PriorityQueue<T,P>가 최소 힙 구현체",
          "힙 정렬: 전체를 힙으로 만든 뒤 하나씩 꺼냄",
        ],
      },
      {
        term: "해시 (Hash)",
        oneliner: "키를 해시 함수로 인덱스 변환. 평균 O(1) 탐색/삽입/삭제",
        detail: [
          "충돌 해결: 체이닝(링크드리스트) vs 오픈 어드레싱(선형/이차 탐사)",
          "로드 팩터 높으면 충돌 증가 → 리해싱으로 확장",
          "C# Dictionary<K,V>: 체이닝 방식. 기본 초기 용량 4",
          "최악의 경우 O(n): 해시 충돌이 전부 같은 버킷으로",
          "GetHashCode() 오버라이드 시 Equals()도 반드시 같이",
        ],
      },
      {
        term: "유니온-파인드 (Union-Find)",
        oneliner: "서로소 집합 관리. 같은 그룹인지 O(α(n)) 확인",
        detail: [
          "Find(x): x의 루트 찾기. 경로 압축으로 최적화",
          "Union(x, y): 두 집합 합치기. 랭크/크기 기준 합치기",
          "활용: 크루스칼 MST, 사이클 감지, 네트워크 연결 여부",
          "int[] parent = Enumerable.Range(0, n).ToArray();",
        ],
      },
    ],
  },
  // ── 탐색/경로 ────────────────────────────────────────────
  {
    id: "pathfinding",
    title: "경로 탐색",
    color: "red",
    items: [
      {
        term: "A* 알고리즘",
        oneliner: "다익스트라 + 휴리스틱. 목적지 방향으로 우선 탐색해 더 빠름",
        detail: [
          "f(n) = g(n) + h(n). g: 출발점까지 실제 비용, h: 목적지까지 추정 비용",
          "h가 실제보다 크지 않아야(admissible) 최적 경로 보장",
          "맨해튼 거리(격자): |dx| + |dy|, 유클리드: sqrt(dx²+dy²)",
          "h = 0이면 다익스트라와 동일",
          "게임 맵 경로 탐색, 내비게이션에 많이 씀",
          "PriorityQueue로 열린 목록(open list) 관리",
        ],
      },
      {
        term: "벨만-포드 (Bellman-Ford)",
        oneliner: "음수 가중치 허용 최단 경로. O(VE). 음수 사이클 감지 가능",
        detail: [
          "V-1번 모든 간선 이완. V번째에도 이완되면 음수 사이클 존재",
          "다익스트라보다 느리지만 음수 간선 처리 가능",
        ],
      },
      {
        term: "플로이드-워셜 (Floyd-Warshall)",
        oneliner: "모든 쌍 최단 경로. O(V³). 작은 그래프에서 전체 경로 필요할 때",
        detail: [
          "dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])  // k = 경유 노드",
          "V가 수백 이하일 때만 실용적",
          "음수 간선 허용, 음수 사이클 감지 가능(대각선이 음수면)",
        ],
      },
      {
        term: "MST (최소 신장 트리)",
        oneliner: "모든 노드를 연결하는 최소 비용 트리",
        detail: [
          "크루스칼: 간선 오름차순 정렬 → Union-Find로 사이클 체크. O(E log E)",
          "프림: 현재 트리에서 가장 가까운 노드 추가. PriorityQueue 활용. O(E log V)",
          "V-1개 간선, 사이클 없음이 MST의 특성",
        ],
      },
    ],
  },
  // ── 동시성 ───────────────────────────────────────────────
  {
    id: "concurrency",
    title: "동시성 / 비동기",
    color: "red",
    items: [
      {
        term: "async / await",
        oneliner: "비동기 작업을 동기처럼 읽기 쉽게. I/O 대기 중 스레드 반환",
        detail: [
          "async 메서드는 Task 또는 Task<T> 반환",
          "await는 작업 완료까지 현재 컨텍스트 일시 정지 (블록 아님)",
          "CPU 바운드 작업: Task.Run(() => ...) 으로 스레드풀에 넘김",
          "I/O 바운드 작업: async 네이티브 API 바로 await (스레드 낭비 없음)",
          "ConfigureAwait(false): UI 컨텍스트 복귀 불필요할 때 성능 최적화",
          "async void는 예외 전파 불가 → 이벤트 핸들러 외 금지",
        ],
      },
      {
        term: "프로세스 vs 스레드",
        oneliner: "프로세스는 독립 메모리 공간, 스레드는 프로세스 내 실행 단위",
        detail: [
          "프로세스: 독립 메모리. 통신은 IPC(파이프, 소켓 등). 격리성 강함",
          "스레드: 같은 힙 공유. 컨텍스트 스위칭 빠름. 경쟁 조건 주의",
          "C# Thread vs Task: Task는 스레드풀 재사용 → 생성 비용 낮음",
        ],
      },
      {
        term: "경쟁 조건 / 동기화",
        oneliner: "여러 스레드가 공유 자원 동시 접근 → 결과가 실행 순서에 따라 달라짐",
        detail: [
          "lock(obj) { }: 한 번에 하나의 스레드만 진입. 교착상태 주의",
          "Interlocked.Increment(ref n): 원자적 정수 연산",
          "SemaphoreSlim: 동시 접근 수 제한",
          "ConcurrentDictionary / ConcurrentQueue: 스레드 안전 컬렉션",
          "volatile: 캐시 무시하고 항상 메모리에서 읽음",
        ],
      },
      {
        term: "교착상태 (Deadlock)",
        oneliner: "두 스레드가 서로 상대방이 쥔 락을 기다려 무한 대기",
        detail: [
          "조건: 상호 배제, 점유 대기, 비선점, 순환 대기 (전부 해당해야 발생)",
          "예방: 항상 같은 순서로 락 획득",
          "lock(A) → lock(B) 와 lock(B) → lock(A) 가 동시에 있으면 위험",
          "Monitor.TryEnter(obj, timeout)으로 타임아웃 설정",
        ],
      },
      {
        term: "Mutex / Semaphore / Monitor 심화",
        oneliner: "락 도구는 목적이 다름. 배타 접근인지, 동시 수 제한인지 먼저 구분",
        detail: [
          "Monitor(lock): 프로세스 내부 임계구역 보호에 가장 일반적. C# lock 키워드가 Monitor 래핑",
          "Mutex: OS 커널 객체 기반, 프로세스 간 동기화 가능. 상대적으로 무겁지만 cross-process 가능",
          "Semaphore/SemaphoreSlim: 동시에 N개까지 진입 허용. 커넥션 풀, 작업 슬롯 제한에 적합",
          "SemaphoreSlim은 사용자 모드 경량 구현 + async/await 친화적이라 서버 코드에서 선호",
          "면접 포인트: '배타 1개'면 lock/Monitor, '동시성 제한'이면 Semaphore, '프로세스 간'이면 Mutex",
          "락 보유 시간 최소화가 핵심. I/O를 락 안에서 수행하면 스루풋 급감",
          "재진입 필요 여부, 타임아웃/취소 필요 여부(CancellationToken)까지 고려해 도구 선택",
          "흔한 실수: public 객체를 lock 대상으로 사용해 외부 코드와 우발적 교착 유발",
        ],
      },
      {
        term: "거짓 공유 (False Sharing)",
        oneliner: "서로 다른 변수여도 같은 캐시 라인에 있으면 멀티코어에서 성능이 급락",
        detail: [
          "CPU 캐시 라인(보통 64B) 단위로 일관성 프로토콜(MESI)이 동작해 불필요한 invalidation 발생",
          "스레드 A/B가 각자 다른 카운터를 수정해도 같은 캐시 라인이면 캐시 핑퐁으로 느려짐",
          "증상: 락이 없는데도 코어 수 늘릴수록 throughput이 오히려 감소",
          "해결: 패딩 추가, 스레드별 로컬 누적 후 병합, 자료구조 분리(StructLayout/필드 간격 조정)",
          "면접 포인트: race condition과의 차이 설명(정합성 문제 vs 성능 문제)",
          "게임/서버 루프에서 per-thread stats, counters, job queue 메타데이터에서 자주 발생",
          "벤치마크 시 Debug 모드/작은 데이터셋에서는 재현이 어려워 Release + 충분한 반복 필요",
          "C#에서도 [StructLayout(LayoutKind.Explicit)] 또는 배열 stride 조정으로 완화 가능",
        ],
      },
      {
        term: "메모리 모델: volatile / Interlocked / lock",
        oneliner: "가시성, 원자성, 순서 보장은 각각 다름. 상황별로 도구를 분리해서 써야 함",
        detail: [
          "volatile: 최신 값 가시성(메모리 배리어) 제공. 복합 연산(++, +=)의 원자성은 보장하지 않음",
          "Interlocked: 단일 변수 원자 연산(Increment, CompareExchange) 제공. lock-free 카운터에 적합",
          "lock(Monitor): 임계구역 전체의 상호 배제 + 진입/탈출 배리어 제공",
          "면접 포인트: volatile만으로 스레드 안전하다고 보면 오답. 원자성과 불변식 보호는 별개",
          "Double-checked locking은 volatile/메모리 배리어 이해 없이 구현하면 초기화 경쟁 가능",
          "CAS(Compare-And-Swap) 기반 구조는 빠를 수 있지만 스핀과 ABA 문제를 고려해야 함",
          "읽기 대부분/쓰기 드문 케이스는 ReaderWriterLockSlim도 선택지",
          "흔한 실수: bool 플래그 하나를 volatile로 두고 복수 필드 상태를 함께 동기화하려고 시도",
        ],
      },
    ],
  },
  // ── 네트워크/웹 ──────────────────────────────────────────
  {
    id: "network",
    title: "네트워크 / 웹 기초",
    color: "white",
    items: [
      {
        term: "OSI 7계층 + TCP/IP 매핑",
        oneliner: "면접 단골: 계층별 역할, 대표 프로토콜, 장애 지점 설명 가능해야 함",
        detail: [
          "L7 응용: HTTP, gRPC, DNS / L6 표현: 인코딩, TLS / L5 세션: 세션 유지",
          "L4 전송: TCP/UDP, 포트, 재전송 / L3 네트워크: IP, 라우팅 / L2 데이터링크: MAC, 스위치 / L1 물리",
          "실무에서는 TCP/IP 4계층(응용-전송-인터넷-네트워크 액세스)으로 단순화해 보는 경우가 많음",
          "면접 포인트: 'TLS는 전통 OSI에서 표현/세션 경계, 실무에선 L4~L7 사이로 취급' 정도의 유연한 설명",
          "문제 분류 예시: TCP 재전송 지연은 L4, 라우팅 불가/TTL은 L3, DNS 실패는 L7",
          "캡슐화 흐름: 앱 데이터 → TCP/UDP 헤더 → IP 헤더 → 이더넷 프레임",
          "게임 클라 관점: 실시간 입력은 UDP 성향, 인증/결제는 TCP/HTTPS 성향 등 트래픽 성격 분리",
          "흔한 실수: HTTP/HTTPS를 전송계층으로 답하거나 DNS를 L3로 잘못 분류",
        ],
      },
      {
        term: "HTTP vs HTTPS",
        oneliner: "HTTPS는 HTTP + TLS 암호화. 포트 80 vs 443",
        detail: [
          "TLS 핸드셰이크: 인증서 검증 → 세션 키 교환 → 대칭 암호화",
          "HTTP/1.1: Keep-Alive 기본. 요청마다 순서대로 처리",
          "HTTP/2: 멀티플렉싱. 하나의 TCP 연결로 병렬 요청",
          "HTTP/3: UDP(QUIC) 기반. 연결 설정 빠름",
        ],
      },
      {
        term: "REST API 원칙",
        oneliner: "자원(URI) + 행위(HTTP 메서드) + 표현(JSON). 무상태",
        detail: [
          "GET: 조회, POST: 생성, PUT: 전체 수정, PATCH: 부분 수정, DELETE: 삭제",
          "무상태(Stateless): 각 요청이 독립적. 서버가 클라이언트 상태 저장 안 함",
          "2xx 성공, 3xx 리다이렉트, 4xx 클라이언트 오류, 5xx 서버 오류",
          "멱등성: GET/PUT/DELETE는 여러 번 호출해도 결과 같음. POST는 아님",
        ],
      },
      {
        term: "TCP vs UDP",
        oneliner: "TCP는 신뢰성 보장(연결형), UDP는 빠르지만 손실 허용(비연결형)",
        detail: [
          "TCP: 3-way 핸드셰이크, 순서 보장, 재전송, 흐름/혼잡 제어",
          "UDP: 핸드셰이크 없음. 순서/전달 보장 없음. 오버헤드 낮음",
          "TCP: HTTP, 파일 전송, 이메일 / UDP: DNS, 스트리밍, 게임",
          "Head-of-Line Blocking: TCP는 앞 패킷 지연이 뒤 데이터까지 막음. 실시간 게임에 불리할 수 있음",
          "UDP 기반에서도 신뢰가 필요한 데이터는 앱 레벨 ACK/시퀀스 번호로 선택적 재전송 설계",
        ],
      },
      {
        term: "쿠키 vs 세션 vs JWT",
        oneliner: "쿠키는 브라우저 저장, 세션은 서버 저장, JWT는 토큰 자체에 정보 포함",
        detail: [
          "쿠키: 클라이언트 저장. HttpOnly/Secure 설정으로 XSS/탈취 방지",
          "세션: 서버 메모리/DB에 상태 저장. 세션ID만 쿠키로 전송",
          "JWT: 서명된 토큰. 서버 무상태 가능. 만료 전 폐기 어려움",
          "Access Token(짧은 만료) + Refresh Token(긴 만료) 패턴 많이 씀",
        ],
      },
    ],
  },
  // ── DB ────────────────────────────────────────────────────
  {
    id: "database",
    title: "데이터베이스",
    color: "white",
    items: [
      {
        term: "ACID",
        oneliner: "트랜잭션의 4가지 성질. 원자성, 일관성, 격리성, 지속성",
        detail: [
          "Atomicity: 전부 성공 or 전부 실패. 중간 상태 없음",
          "Consistency: 트랜잭션 전후 DB 무결성 제약 유지",
          "Isolation: 동시 실행 트랜잭션이 서로 영향 안 줌",
          "Durability: 커밋된 데이터는 장애에도 유지",
        ],
      },
      {
        term: "인덱스",
        oneliner: "조회 속도 O(log n)으로 향상. 쓰기는 느려짐",
        detail: [
          "B-Tree 인덱스: 범위 탐색에 강함. 대부분 RDBMS 기본",
          "Hash 인덱스: 등치 탐색만 O(1). 범위 탐색 불가",
          "복합 인덱스: 왼쪽 컬럼부터 순서 중요 (leftmost prefix)",
          "인덱스 많으면 INSERT/UPDATE/DELETE 느려짐. 선택적으로",
          "EXPLAIN으로 쿼리 실행 계획 확인",
        ],
      },
      {
        term: "정규화",
        oneliner: "중복 제거, 이상 현상 방지. 1NF→2NF→3NF→BCNF",
        detail: [
          "1NF: 각 컬럼이 원자값 (반복 그룹 없음)",
          "2NF: 부분 함수 종속 제거 (복합 PK에서 일부에만 종속된 컬럼 분리)",
          "3NF: 이행 함수 종속 제거 (PK → A → B 에서 B를 분리)",
          "과도한 정규화 → JOIN 많아짐 → 성능 저하 → 비정규화로 트레이드오프",
        ],
      },
      {
        term: "SQL vs NoSQL",
        oneliner: "SQL은 스키마+관계 강점, NoSQL은 유연한 구조+수평 확장 강점",
        detail: [
          "SQL: 스키마 고정, JOIN, 트랜잭션 ACID, 수직 확장",
          "NoSQL(문서): MongoDB. 스키마 유연, JSON 형태, 수평 확장",
          "NoSQL(키-값): Redis. 초고속 캐시, TTL, pub/sub",
          "NoSQL(그래프): Neo4j. 관계 탐색에 특화",
          "CAP 정리: 분산 시스템에서 일관성/가용성/분단 허용 중 2개만 보장",
        ],
      },
    ],
  },
  // ── 고급 알고리즘 테크닉 ─────────────────────────────────
  {
    id: "algo-techniques",
    title: "코테 핵심 테크닉",
    color: "red",
    items: [
      {
        term: "투 포인터 (Two Pointer)",
        oneliner: "정렬된 배열에서 양쪽 끝 포인터를 좁혀가며 O(n) 탐색",
        detail: [
          "left=0, right=n-1 에서 시작. 조건에 따라 좁힘",
          "합이 target보다 크면 right--, 작으면 left++",
          "활용: 두 수의 합, 세 수의 합, 부분 배열, 팰린드롬 검사",
          "정렬 안 됐으면 먼저 정렬하거나 해시 사용",
        ],
      },
      {
        term: "슬라이딩 윈도우",
        oneliner: "고정/가변 크기 구간을 이동하며 O(n)으로 구간 최적값 탐색",
        detail: [
          "고정 크기: 윈도우 이동 시 나가는 값 빼고 새 값 더함",
          "가변 크기: 조건 만족 안 하면 left 이동, 만족하면 right 이동",
          "활용: 최대 부분합, 연속 구간에서 특정 조건, 최소 길이 부분 배열",
          "while (left <= right) 구조로 자주 구현",
        ],
      },
      {
        term: "위상 정렬 (Topological Sort)",
        oneliner: "방향 그래프에서 선후 관계 유지한 순서 정렬. DAG에서만 가능",
        detail: [
          "진입차수(in-degree) 0인 노드부터 큐에 넣어 BFS로 처리",
          "노드 꺼낼 때 연결 노드의 진입차수 감소 → 0 되면 큐에 추가",
          "결과 노드 수 < 전체 노드 수 → 사이클 존재",
          "활용: 빌드 의존성, 커리큘럼 순서, 작업 스케줄링",
        ],
      },
      {
        term: "완전탐색 / 백트래킹",
        oneliner: "모든 경우를 탐색하되, 불필요한 분기는 조기 종료(가지치기)",
        detail: [
          "재귀 + 방문 배열로 DFS 구현",
          "가지치기(pruning): 현재 경로가 답이 될 수 없으면 즉시 return",
          "선택 → 재귀 → 선택 취소 (backtrack) 패턴",
          "활용: 순열, 조합, N-Queens, 스도쿠, 부분집합 합",
          "시간복잡도 O(n!) ~ O(2ⁿ). 가지치기 효과가 성능 좌우",
        ],
      },
      {
        term: "구간 합 (Prefix Sum)",
        oneliner: "누적합 배열로 임의 구간 합을 O(1)에 조회",
        detail: [
          "prefix[i] = arr[0] + arr[1] + ... + arr[i-1]",
          "구간 [l, r] 합 = prefix[r+1] - prefix[l]",
          "2D prefix sum: 직사각형 구간 합을 O(1)에",
          "활용: 구간 쿼리, 부분 배열 합 조건, 차이 배열(difference array)",
        ],
      },
      {
        term: "트라이 (Trie)",
        oneliner: "문자열 집합을 트리로 저장. 접두사 탐색 O(L). 자동완성, 사전에 씀",
        detail: [
          "각 노드가 문자 하나. 루트에서 단말까지 경로가 하나의 단어",
          "삽입/탐색 모두 O(L). L = 문자열 길이",
          "children[26] 배열 또는 Dictionary<char, TrieNode>로 구현",
          "isEnd 플래그로 단어 끝 표시",
          "활용: 자동완성, 공통 접두사 찾기, 문자열 집합 빠른 탐색",
        ],
      },
      {
        term: "세그먼트 트리",
        oneliner: "구간 쿼리 + 점 업데이트를 O(log n)에. 구간 합/최솟값/최댓값",
        detail: [
          "완전 이진 트리. 리프는 원소, 내부 노드는 구간 집계",
          "배열 크기 4n 잡으면 안전. 루트는 인덱스 1",
          "Build O(n), Query O(log n), Update O(log n)",
          "Lazy Propagation: 구간 업데이트도 O(log n)으로",
          "BIT(Fenwick Tree): 구간 합 특화. 구현 더 간단, 상수 작음",
        ],
      },
      {
        term: "좌표 압축",
        oneliner: "값 범위가 크지만 개수가 적을 때, 인덱스로 치환해서 처리",
        detail: [
          "값 정렬 → 중복 제거 → 원래 값을 인덱스로 매핑",
          "Array.Sort + LINQ Distinct + Array.BinarySearch 조합",
          "활용: 세그먼트 트리 범위 축소, 값 범위 10^9이지만 개수 10^5인 경우",
        ],
      },
    ],
  },
  // ── OS / 시스템 기초 ─────────────────────────────────────
  {
    id: "os-basics",
    title: "OS / 시스템 기초",
    color: "white",
    items: [
      {
        term: "프로세스 스케줄링",
        oneliner: "CPU를 어떤 프로세스에 얼마나 줄지 결정하는 OS 정책",
        detail: [
          "FCFS: 도착 순서대로. 단순하지만 convoy 효과(긴 작업이 앞에 있으면 전체 지연)",
          "SJF: 실행 시간 짧은 것 먼저. 최적 평균 대기시간. 실행 시간 예측 어려움",
          "Round Robin: 시간 퀀텀(타임슬라이스)마다 교체. 공평성. 문맥 교환 비용",
          "우선순위 스케줄링: 우선순위 높은 것 먼저. 기아(starvation) 문제 → aging으로 해결",
          "CFS(Linux): 가상 실행시간 기반. 공평한 CPU 시간 배분",
        ],
      },
      {
        term: "메모리 관리 / 가상 메모리",
        oneliner: "물리 메모리보다 큰 주소 공간 제공. 페이징으로 구현",
        detail: [
          "페이징: 물리 메모리를 고정 크기(페이지)로 분할. 외부 단편화 없음",
          "페이지 폴트: 접근한 페이지가 RAM에 없어 디스크에서 로드",
          "페이지 교체: LRU(최근 미사용), FIFO, Clock 알고리즘",
          "TLB: 페이지 테이블 캐시. 가상→물리 주소 변환 빠르게",
          "스래싱(Thrashing): 페이지 폴트가 너무 많아 CPU가 교체만 하는 상태",
        ],
      },
      {
        term: "캐시 메모리",
        oneliner: "CPU와 RAM 사이 고속 메모리. 지역성(locality) 원리로 효과",
        detail: [
          "시간적 지역성: 최근 접근한 데이터는 곧 또 접근할 가능성 높음",
          "공간적 지역성: 접근한 주소 근처도 곧 접근할 가능성 높음",
          "L1(코어 내) → L2(코어 내/공유) → L3(공유) → RAM → 디스크",
          "캐시 미스: Cold(첫 접근), Capacity(용량 초과), Conflict(매핑 충돌)",
          "배열 순차 접근이 랜덤 접근보다 빠른 이유 = 캐시 라인 활용",
        ],
      },
      {
        term: "인터럽트 / 시스템 콜",
        oneliner: "하드웨어 이벤트나 프로그램 요청으로 OS 커널 모드 진입",
        detail: [
          "인터럽트: 외부(I/O 완료, 타이머) 또는 내부(예외, 0으로 나누기) 발생",
          "시스템 콜: 사용자 모드 → 커널 모드 진입. OS 서비스 요청",
          "컨텍스트 스위칭: 레지스터, PC, 스택 포인터 저장/복원. 비용 발생",
          "인터럽트 처리기(ISR)는 빠르게 완료해야 함 → 긴 처리는 하위 반쪽(bottom half)으로",
        ],
      },
      {
        term: "뮤텍스 vs 세마포어 vs 모니터",
        oneliner: "뮤텍스는 소유권 있는 이진 락, 세마포어는 카운터 기반, 모니터는 언어 레벨 추상화",
        detail: [
          "뮤텍스: 소유한 스레드만 해제 가능. 재진입 가능(recursive) 버전도 있음",
          "이진 세마포어: 뮤텍스와 유사하지만 소유권 없음. 다른 스레드가 해제 가능",
          "카운팅 세마포어: N개까지 동시 접근 허용. 생산자-소비자 패턴",
          "C# lock: 내부적으로 Monitor.Enter/Exit. 재진입 가능",
          "SemaphoreSlim: 비동기 대기(await)도 지원",
        ],
      },
    ],
  },
  // ── 보안 ─────────────────────────────────────────────────
  {
    id: "security",
    title: "보안 기초",
    color: "red",
    items: [
      {
        term: "SQL 인젝션",
        oneliner: "사용자 입력이 SQL 쿼리에 그대로 삽입돼 악의적 쿼리 실행",
        detail: [
          "취약: \"SELECT * FROM users WHERE id = \" + input",
          "방어: 파라미터화된 쿼리(PreparedStatement), ORM 사용",
          "input = \"1 OR 1=1\" 이면 전체 테이블 노출",
          "ORM(Entity Framework)은 기본적으로 파라미터화 처리",
        ],
      },
      {
        term: "XSS (크로스 사이트 스크립팅)",
        oneliner: "악성 스크립트를 웹 페이지에 삽입해 다른 사용자 브라우저에서 실행",
        detail: [
          "저장형: DB에 스크립트 저장 → 다른 사용자 조회 시 실행",
          "반사형: URL 파라미터에 스크립트 → 서버가 그대로 응답에 포함",
          "방어: 출력 시 HTML 인코딩(&lt; &gt;), CSP 헤더, HttpOnly 쿠키",
          "React/Next.js는 기본적으로 JSX 내용을 이스케이프함",
        ],
      },
      {
        term: "CSRF (크로스 사이트 요청 위조)",
        oneliner: "로그인된 사용자의 권한으로 의도치 않은 요청을 다른 사이트에서 발생시킴",
        detail: [
          "피해자가 악성 사이트 방문 → 자동으로 피해자 권한으로 요청 전송",
          "방어: CSRF 토큰(요청마다 랜덤 토큰 검증), SameSite 쿠키, Referer 검증",
          "GET 요청으로 상태 변경하면 위험 → REST 원칙 준수",
        ],
      },
      {
        term: "암호화 기초",
        oneliner: "대칭키(AES)는 빠르고, 비대칭키(RSA)는 키 교환에, 해시(SHA)는 무결성",
        detail: [
          "대칭키: 같은 키로 암호화/복호화. AES-256. 키 배포 문제",
          "비대칭키: 공개키로 암호화, 개인키로 복호화. RSA, ECC. 느림",
          "TLS: 비대칭키로 세션키 교환 → 이후 대칭키로 통신",
          "해시: 단방향. 비밀번호 저장 시 bcrypt/Argon2 (salt 포함) 사용",
          "MD5/SHA-1은 취약. 비밀번호엔 절대 사용 금지",
        ],
      },
    ],
  },
  // ── 테스트 / 개발 방법론 ────────────────────────────────
  {
    id: "testing",
    title: "테스트 / 개발 방법론",
    color: "white",
    items: [
      {
        term: "단위 테스트 (Unit Test)",
        oneliner: "함수/메서드 하나를 독립적으로 테스트. 빠르고 격리됨",
        detail: [
          "C#: xUnit, NUnit, MSTest. xUnit이 최근 표준",
          "AAA 패턴: Arrange(준비) → Act(실행) → Assert(검증)",
          "Mock: 의존성을 가짜 객체로 대체. Moq 라이브러리",
          "테스트하기 어려운 코드 = 설계가 나쁜 신호. DI로 개선",
          "[Fact]: 단일 테스트. [Theory] + [InlineData]: 파라미터 테스트",
        ],
      },
      {
        term: "통합 테스트 / E2E 테스트",
        oneliner: "여러 컴포넌트가 함께 동작하는지 테스트. 실제 DB/네트워크 사용",
        detail: [
          "통합 테스트: 서비스 + DB + API 레이어 함께 테스트",
          "E2E: 실제 브라우저로 사용자 시나리오 전체 테스트. Playwright, Selenium",
          "TestContainers: 테스트용 Docker 컨테이너로 실제 DB 실행",
          "속도 느림 → 빌드 파이프라인 후반에 실행",
        ],
      },
      {
        term: "TDD (테스트 주도 개발)",
        oneliner: "테스트 먼저 작성 → 실패 확인 → 구현 → 리팩터. Red-Green-Refactor",
        detail: [
          "Red: 실패하는 테스트 작성",
          "Green: 테스트 통과하는 최소 코드 작성",
          "Refactor: 동작 유지하며 코드 개선",
          "장점: 자연스럽게 테스트 가능한 설계, 과설계 방지",
          "단점: 초기 속도 느림. UI/탐색적 작업엔 잘 안 맞음",
        ],
      },
      {
        term: "CI/CD",
        oneliner: "코드 변경 → 자동 빌드/테스트 → 자동 배포까지의 파이프라인",
        detail: [
          "CI (지속적 통합): PR 시 자동 빌드 + 테스트. 머지 전 품질 검증",
          "CD (지속적 배포/전달): 테스트 통과 시 자동 배포",
          "GitHub Actions, GitLab CI, Jenkins 등",
          "브랜치 전략: main(배포), develop(통합), feature/* (기능)",
          "무중단 배포: 블루-그린, 카나리 배포, 롤링 업데이트",
        ],
      },
      {
        term: "코드 품질 지표",
        oneliner: "유지보수 가능한 코드를 측정하는 지표들",
        detail: [
          "테스트 커버리지: 코드 중 테스트된 비율. 100%가 목표가 되면 안 됨",
          "순환 복잡도(Cyclomatic): 분기 경로 수. 10 이하 권장",
          "코드 중복: DRY 원칙. 중복 발견 시 추출 리팩터",
          "기술 부채: 빠른 해결책으로 쌓인 나중에 고쳐야 할 코드",
          "정적 분석: SonarQube, Roslyn Analyzer, StyleCop",
        ],
      },
    ],
  },
  // ── C# 특화 면접 ────────────────────────────────────────
  {
    id: "csharp-interview",
    title: "C# 면접 단골 주제",
    color: "yellow",
    items: [
      {
        term: "IDisposable 패턴",
        oneliner: "관리되지 않는 자원(파일, DB 연결, 소켓)을 GC 전에 명시적 해제",
        detail: [
          "Dispose() 메서드에서 자원 해제. GC.SuppressFinalize(this) 호출",
          "using 블록: 블록 끝에서 자동 Dispose() 호출 보장",
          "using 선언(C# 8+): using var conn = ...; // 스코프 끝에 자동 해제",
          "Finalizer(~ClassName): GC가 수거 전 호출. 타이밍 비결정적 → Dispose에서 처리하는 게 나음",
          "Dispose(bool disposing): true면 명시적 호출, false면 finalizer에서 호출",
        ],
      },
      {
        term: "string intern / == vs Equals",
        oneliner: "string은 == 가 값 비교지만, object는 참조 비교. 혼동 주의",
        detail: [
          "C# string ==: 내용 비교 (Equals와 동일)",
          "object ==: 참조 비교. 박싱된 int 등에서 == 는 false 나올 수 있음",
          "string.Intern: 같은 내용의 문자열을 하나만 유지. 메모리 절약",
          "string 리터럴은 자동으로 intern됨",
          "ReferenceEquals(a, b): 참조 동일 여부 강제 확인",
        ],
      },
      {
        term: "covariance / contravariance",
        oneliner: "제네릭 타입의 상속 관계 허용 여부. out은 공변, in은 반변",
        detail: [
          "공변(covariance, out): IEnumerable<Dog>를 IEnumerable<Animal>로 사용 가능",
          "반변(contravariance, in): Action<Animal>을 Action<Dog>로 사용 가능",
          "interface IEnumerable<out T>: T를 반환에만 사용 → 공변",
          "interface IComparable<in T>: T를 파라미터에만 사용 → 반변",
          "class/struct는 공변/반변 불가. 인터페이스/델리게이트만 가능",
        ],
      },
      {
        term: "Expression Tree",
        oneliner: "람다를 데이터(AST)로 표현. LINQ to SQL이 쿼리로 변환하는 데 씀",
        detail: [
          "Expression<Func<int, bool>> expr = x => x > 5;",
          "Compile()으로 실제 델리게이트로 변환 가능",
          "LINQ to EF: Expression을 분석해 SQL WHERE 절 생성",
          "동적 쿼리 빌더, 규칙 엔진에 활용",
        ],
      },
      {
        term: "reflection",
        oneliner: "런타임에 타입 정보 조회/조작. 플러그인, DI 컨테이너, 직렬화에 씀",
        detail: [
          "typeof(T).GetProperties(): 프로퍼티 목록",
          "obj.GetType().GetMethod(\"Name\").Invoke(obj, args): 메서드 동적 호출",
          "Attribute 조회: GetCustomAttributes(typeof(MyAttr), false)",
          "성능 비용 있음 → 캐싱하거나 source generator로 대체 (C# 9+)",
          "Assembly.Load(): 런타임에 어셈블리 로드. 플러그인 시스템",
        ],
      },
    ],
  },
  // ── 메모리 최적화 ────────────────────────────────────────
  {
    id: "memory-optimization",
    title: "메모리 최적화 / 성능",
    color: "red",
    items: [
      {
        term: "Span<T> / Memory<T>",
        oneliner: "힙 할당 없이 배열·문자열 슬라이싱. GC 압박 없음",
        detail: [
          "Span<T>: 스택 전용. ref struct라 힙에 저장 불가. async 메서드에 사용 불가",
          "Memory<T>: 힙에 저장 가능. async 메서드에서 사용. Span보다 약간 느림",
          "ReadOnlySpan<char>: string 슬라이싱 → 새 문자열 할당 없이 부분 파싱",
          "int.Parse(span): string 변환 없이 직접 파싱 → 할당 0",
          "배열 복사 대신 Span.Slice(): 데이터 이동 없이 뷰(view)만 생성",
          "고성능 파서, 네트워크 패킷 처리, 이진 프로토콜에 핵심",
        ],
      },
      {
        term: "stackalloc",
        oneliner: "스택에 배열 할당. GC 대상 아님 → 즉시 해제, 0 할당 비용",
        detail: [
          "Span<int> buf = stackalloc int[128]; // 스택에 512바이트 할당",
          "메서드 종료 시 자동 해제. GC 수거 불필요",
          "크기가 크면 StackOverflowException 위험 → 보통 1KB 이하 권장",
          "unsafe 없이 Span<T>로 감싸서 사용 가능 (C# 7.2+)",
          "고빈도 호출 메서드의 임시 버퍼에 효과적 (파싱, 암호화, 포맷팅)",
        ],
      },
      {
        term: "ArrayPool<T>",
        oneliner: "배열을 풀에서 빌리고 반납. 반복 할당/해제 비용 제거",
        detail: [
          "ArrayPool<byte>.Shared.Rent(size): 요청 크기 이상의 배열 반환 (더 클 수 있음)",
          "ArrayPool<byte>.Shared.Return(arr, clearArray: false): 반납. 꼭 반납해야 함",
          "반환된 배열 크기 != 요청 크기일 수 있음 → Length 대신 요청 크기 변수로 관리",
          "ASP.NET Core, SignalR 등 내부적으로 대량 사용",
          "try/finally로 Return 보장 또는 IMemoryOwner<T> 패턴 사용",
        ],
      },
      {
        term: "ObjectPool<T>",
        oneliner: "생성 비용 큰 객체(StringBuilder, DB 연결 등)를 풀에서 재사용",
        detail: [
          "Microsoft.Extensions.ObjectPool.ObjectPool<T> (ASP.NET Core 제공)",
          "pool.Get()으로 빌리고, pool.Return(obj)로 반납",
          "StringBuilder 풀: new StringBuilder() 반복 생성 대신 풀에서 재사용",
          "DB 연결 풀(Connection Pooling): ADO.NET이 내부적으로 자동 관리",
          "반납 전 객체 상태 초기화 필수 (민감한 데이터 잔류 방지)",
        ],
      },
      {
        term: "struct 최적화",
        oneliner: "작고 불변인 데이터는 struct로 → 힙 할당 없음",
        detail: [
          "16바이트 이하, 불변, 단순 데이터 → struct가 class보다 유리",
          "readonly struct: 모든 필드 readonly 강제. 방어적 복사 방지",
          "ref struct: 스택 전용 강제. Span<T>가 대표 사례",
          "in 파라미터: 큰 struct를 복사 없이 읽기 전용 참조로 전달",
          "메서드 반환 시 struct 복사 발생 → ref return으로 방지 가능",
          "IEquatable<T> 구현: Equals(object) 박싱 방지",
        ],
      },
      {
        term: "GC 압박 줄이기",
        oneliner: "할당을 줄이면 GC 빈도가 낮아져 STW(Stop-the-world) 감소",
        detail: [
          "0세대 GC: 수십 ms. 1세대: 수백 ms. 2세대(Full GC): 수백 ms~초 단위",
          "할당 줄이기: struct, Span, stackalloc, ArrayPool, ObjectPool 활용",
          "대형 객체(85KB+) 주의: LOH는 압축 안 됨 → 단편화 발생",
          "GC.TryStartNoGCRegion(): 지정 구간 GC 억제. 레이턴시 크리티컬 구간에 사용",
          "Server GC vs Workstation GC: 서버는 멀티코어 병렬 GC → 처리량 높음",
          "메모리 진단: dotMemory, PerfView, EventPipe로 할당 핫스팟 분석",
        ],
      },
      {
        term: "string 메모리 최적화",
        oneliner: "string은 불변이라 반복 연결이 O(n²). 올바른 도구 선택이 핵심",
        detail: [
          "루프 내 += 금지: 매번 새 문자열 할당 → O(n²). StringBuilder 사용",
          "string.Create(len, state, spanAction): 단일 할당으로 string 직접 생성 (C# 7+)",
          "String interning: string.Intern(s) — 동일 내용 문자열을 하나로 공유",
          "리터럴 문자열은 자동 intern. 런타임 생성 문자열은 미적용",
          "ReadOnlySpan<char>: 부분 문자열 추출 시 새 string 할당 없음",
          "char[] / Span<char> 버퍼에 작성 후 new string(span)으로 한 번만 변환",
        ],
      },
      {
        term: "값 타입 캐싱 (박싱 방지 패턴)",
        oneliner: "제네릭·EqualityComparer로 박싱 없이 값 타입 비교·저장",
        detail: [
          "Dictionary<int, T> 대신 Hashtable 쓰면 키 int가 박싱됨 → 제네릭 사용",
          "EqualityComparer<T>.Default.Equals(a, b): 박싱 없이 값 타입 동등성 비교",
          "IEquatable<T> 구현: Equals(object) 오버라이드로 박싱 방지",
          "Enum 박싱: switch(enumVal) 는 안전. IComparable에 넘기면 박싱 발생",
          "nullable 값 타입(int?) 박싱: HasValue가 true면 박싱 시 T 타입 object",
          "컬렉션 Contains/IndexOf: IEquatable<T> 없으면 object.Equals 호출 → 박싱",
        ],
      },
    ],
  },
];
